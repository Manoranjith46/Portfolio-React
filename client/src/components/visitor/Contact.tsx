import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AtSign, Phone, MapPin } from 'lucide-react'
import emailjs from '@emailjs/browser'
import CustomIcon from '@/components/shared/CustomIcon'
import { useProfile } from '@/api/portfolio'
import { useToast } from '@/components/shared/Toast'

gsap.registerPlugin(ScrollTrigger)

const contactSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .refine((val) => /^\d{10,}$/.test(val.replace(/\D/g, '')), 'Please enter a valid phone number (at least 10 digits)'),
  message: z.string().min(1, 'Message is required'),
})

type ContactForm = z.infer<typeof contactSchema>

const Contact = () => {
  const { data: profile } = useProfile()
  const { showToast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: '#contact',
        start: '20% bottom',
        end: 'bottom top',
      },
    })
    tl.from('#contact .box', { opacity: 0, y: 30, stagger: 0.5, immediateRender: false })
      .from('#contact .contact__form', { opacity: 0, x: 30, immediateRender: false })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const onSubmit = async (data: ContactForm) => {
    try {
      await emailjs.send(
        'mailto_mano',
        'mailto_mano_template',
        {
          name: `${data.firstname} ${data.lastname}`,
          from_email: data.email,
          time: new Date().toLocaleString(),
          mobile: data.phone,
          message: data.message,
          to_name: 'Manoranjith',
        },
        'vGYFhAtmaUDVyTYGY',
      )
      showToast('Message sent successfully!', 'success')
      reset()
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error')
      console.error('EmailJS error:', error)
    }
  }

  return (
    <section id="contact">
      <div className="container">
        <div className="left__column">
          <div className="box">
            <div className="cluster">
              <h2 className="sub__title">
                Let's <span className="primary">create something</span> amazing together!
              </h2>
              <p className="description">
                Feel free to reach out for projects, collaborations, or web development inquiries via the form or email!
              </p>
            </div>
            <CustomIcon name="list-option-ui" className="list__ui" />
          </div>
          <div className="box">
            <div className="cluster">
              <div className="flex option">
                <div className="icon__container"><AtSign /></div>
                <div className="details">
                  <h3 className="name">Email</h3>
                  <p className="text__muted value">{profile.email}</p>
                </div>
              </div>
              <div className="flex option">
                <div className="icon__container"><Phone /></div>
                <div className="details">
                  <h3 className="name">Phone</h3>
                  <p className="text__muted value">{profile.phone}</p>
                </div>
              </div>
              <div className="flex option">
                <div className="icon__container"><MapPin /></div>
                <div className="details">
                  <h3 className="name">Address</h3>
                  <p className="text__muted value">{profile.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form className="contact__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="spotlight"></div>
          <h2 className="sub__title">
            Let's work <span className="primary">together!</span>
          </h2>
          <div className="row">
            <div>
              <input type="text" placeholder="First name" className="control" {...register('firstname')} />
              {errors.firstname && <p className="error" style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.firstname.message}</p>}
            </div>
            <div>
              <input type="text" placeholder="Last name" className="control" {...register('lastname')} />
              {errors.lastname && <p className="error" style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.lastname.message}</p>}
            </div>
          </div>
          <div className="row">
            <div>
              <input type="email" placeholder="Email address" className="control" {...register('email')} />
              {errors.email && <p className="error" style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.email.message}</p>}
            </div>
            <div>
              <input type="tel" placeholder="Phone number" className="control" {...register('phone')} />
              {errors.phone && <p className="error" style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <textarea placeholder="Message" className="control" {...register('message')}></textarea>
            {errors.message && <p className="error" style={{ color: 'var(--danger)', fontSize: 12 }}>{errors.message.message}</p>}
          </div>
          <button type="submit" className="btn btn__primary submit__btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Now'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
