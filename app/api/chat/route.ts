import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const BUSINESS_CONTEXT = `You are an AI assistant for Ahmed Optical, a professional eyewear business specializing in:
- High-quality eyeglass frames (designer and affordable options)
- Precision lens fitting and prescription glasses
- Stylish sunglasses collection (UV protection, polarized options)
- Eye care consultation and frame selection guidance
- Lens options: single vision, bifocal, progressive, blue light blocking, photochromic
- Frame materials: metal, acetate, titanium, plastic
- Expert fitting services to ensure comfort and proper vision correction

Contact Information:
- Phone: 03230093163
- WhatsApp: 03281451038
- Email: ahmadoptical.pk@gmail.com

Your role:
1. Answer questions about eyeglasses, frames, sunglasses, and lens options
2. Provide information about our services and products
3. Help customers choose the right frames and lenses for their needs
4. Explain pricing ranges and quality differences
5. When customers want to make a purchase or need detailed consultation, encourage them to contact us via phone, WhatsApp, or email
6. Be friendly, professional, and knowledgeable about eyewear

Always be helpful and if the customer needs personalized service or wants to place an order, direct them to contact us through the provided contact methods.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: BUSINESS_CONTEXT,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I apologize, but I had trouble processing that. Could you please rephrase your question?'

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { message: 'I apologize for the inconvenience. Please contact us directly at:\n\n📞 Phone: 03230093163\n💬 WhatsApp: 03281451038\n✉️ Email: ahmadoptical.pk@gmail.com' },
      { status: 200 }
    )
  }
}
