import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY!);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { post, audience } = await req.json();

    let query = supabase.from('waitlist').select('email').eq('newsletter_consent', true);
    
    if (audience === 'equipment') query = query.like('source', 'Товар:%');
    else if (audience === 'newsletter') query = query.eq('source', 'footer_newsletter');

    const { data: subscribers, error } = await query;

    if (error) throw new Error("Помилка БД: " + error.message);
    if (!subscribers || subscribers.length === 0) return NextResponse.json({ count: 0 });

    const emails = Array.from(new Set(subscribers.map((s) => s.email)));

    // Generate individual batch payloads to accommodate customized Unsubscribe links
    const emailPayloads = emails.map(email => {
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f2ebe1; border: 1px solid #c39d67;">
          <h1 style="color: #4a5342; text-align: center;">${post.title}</h1>
          <hr style="border-top: 2px solid #c39d67; margin: 20px 0;" />
          <p style="font-size: 18px; font-style: italic; color: #555;">${post.excerpt}</p>
          <div style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
            ${post.content.replace(/\n/g, '<br/>')}
          </div>
          <br/><br/>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://mitlar.com" style="background-color: #4a5342; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">Відвідати сайт гри</a>
          </div>
          <p style="font-size: 12px; color: gray; margin-top: 40px; text-align: center;">
            Ви отримали цей лист, оскільки підписались на новини Mitlar.<br/>
            Щоб припинити отримувати листи, натисніть <a style="color:#c39d67" href="https://mitlar.com/unsubscribe?email=${encodeURIComponent(email)}">відписатись</a>.
          </p>
        </div>
      `;

      return {
        from: 'Mitlar News <info@mitlar.com>',
        replyTo: 'twiklemetlar@gmail.com',
        to: email,
        subject: `[Mitlar] ${post.title}`,
        html: htmlContent,
      };
    });

    // Send the array to Resend Batch API
    const response = await resend.batch.send(emailPayloads);

    if (response.error) throw new Error(response.error.message);

    return NextResponse.json({ success: true, count: emails.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
