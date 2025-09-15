import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import landing_img from './landing_img.png'
import Psychologist from './Dermatologist.svg'
import Psychiatrist from './Gastroenterologist.svg'
import Therapist from './General_physician.svg'
import Counselor from './Gynecologist.svg'
import FamilyTherapist from './Neurologist.svg'
import ChildPsychologist from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    landing_img
}

{/*    "Counselor",
    "Clinical Psychologist",//
    "Psychiatrist",//
    "Marriage Therapist",//
    "Child Psychologist",//
    "Addiction Counselor",//
    "Behavioral Therapist", //*/}

export const specialityData = [
  {
    speciality: 'Clinical Psychologist',
    image: Psychologist
  },
  {
    speciality: 'Psychiatrist',
    image: Psychiatrist
  },
  {
    speciality: 'Behovioral Therapist',
    image: Therapist
  },
  {
    speciality: 'Counselor',
    image: Counselor
  },
  {
    speciality: 'Marriage Therapist',
    image: FamilyTherapist
  },
  {
    speciality: 'Child Psychologist',
    image: ChildPsychologist
  },
  {
    speciality: 'Addiction Counselor',
    image: Therapist
  }
]

export const therapists = [
  {
    _id: 'doc1',
    name: 'Dr. Richard James',
    image: doc1,
    speciality: 'Psychologist',
    degree: 'PhD in Clinical Psychology',
    experience: '4 Years',
    about: 'Focuses on cognitive-behavioral therapy (CBT) and anxiety management, helping clients build healthy coping mechanisms.',
    fees: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc2',
    name: 'Dr. Emily Larson',
    image: doc2,
    speciality: 'Psychiatrist',
    degree: 'MD Psychiatry',
    experience: '3 Years',
    about: 'Provides therapy and medication management for depression, ADHD, and mood disorders with a compassionate approach.',
    fees: 60,
    address: {
      line1: '27th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc3',
    name: 'Dr. Sarah Patel',
    image: doc3,
    speciality: 'Therapist',
    degree: 'MSc Counseling Psychology',
    experience: '1 Year',
    about: 'Supports clients with stress management, burnout recovery, and mindfulness practices for everyday life.',
    fees: 30,
    address: {
      line1: '37th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc4',
    name: 'Dr. Christopher Lee',
    image: doc4,
    speciality: 'Counselor',
    degree: 'MEd Counseling',
    experience: '2 Years',
    about: 'Specializes in relationship counseling, grief support, and providing a safe space for emotional healing.',
    fees: 40,
    address: {
      line1: '47th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc5',
    name: 'Dr. Jennifer Garcia',
    image: doc5,
    speciality: 'Child Psychologist',
    degree: 'PhD in Child Psychology',
    experience: '4 Years',
    about: 'Helps children and teenagers with learning difficulties, social anxiety, and behavioral issues.',
    fees: 50,
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc6',
    name: 'Dr. Andrew Williams',
    image: doc6,
    speciality: 'Psychiatrist',
    degree: 'MD Psychiatry',
    experience: '4 Years',
    about: 'Experienced in treating bipolar disorder, depression, and providing holistic care with therapy and medication.',
    fees: 50,
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc7',
    name: 'Dr. Christopher Davis',
    image: doc7,
    speciality: 'Psychologist',
    degree: 'PhD in Clinical Psychology',
    experience: '4 Years',
    about: 'Passionate about helping clients overcome anxiety, depression, and trauma with evidence-based practices.',
    fees: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc8',
    name: 'Dr. Timothy White',
    image: doc8,
    speciality: 'Family Therapist',
    degree: 'PhD in Family Therapy',
    experience: '3 Years',
    about: 'Works with families and couples to improve communication, resolve conflicts, and strengthen relationships.',
    fees: 60,
    address: {
      line1: '27th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc9',
    name: 'Dr. Ava Mitchell',
    image: doc9,
    speciality: 'Therapist',
    degree: 'MSc Counseling Psychology',
    experience: '1 Year',
    about: 'Focuses on stress relief, work-life balance, and emotional well-being for young professionals and students.',
    fees: 30,
    address: {
      line1: '37th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc10',
    name: 'Dr. Jeffrey King',
    image: doc10,
    speciality: 'Counselor',
    degree: 'MEd Counseling',
    experience: '2 Years',
    about: 'Supports clients in managing grief, personal transitions, and relationship challenges with empathy.',
    fees: 40,
    address: {
      line1: '47th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc11',
    name: 'Dr. Zoe Kelly',
    image: doc11,
    speciality: 'Psychiatrist',
    degree: 'MD Psychiatry',
    experience: '4 Years',
    about: 'Helps clients with mood disorders and medication-assisted treatment, ensuring holistic mental health care.',
    fees: 50,
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc12',
    name: 'Dr. Patrick Harris',
    image: doc12,
    speciality: 'Psychologist',
    degree: 'PhD in Clinical Psychology',
    experience: '4 Years',
    about: 'Uses therapy techniques to address anxiety, phobias, and trauma recovery with a client-centered approach.',
    fees: 50,
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc13',
    name: 'Dr. Chloe Evans',
    image: doc13,
    speciality: 'Therapist',
    degree: 'MSc Counseling Psychology',
    experience: '4 Years',
    about: 'Offers one-on-one therapy sessions for stress, self-esteem issues, and emotional growth.',
    fees: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc14',
    name: 'Dr. Ryan Martinez',
    image: doc14,
    speciality: 'Family Therapist',
    degree: 'PhD in Family Therapy',
    experience: '3 Years',
    about: 'Guides couples and families to resolve conflicts and build stronger emotional connections.',
    fees: 60,
    address: {
      line1: '27th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doc15',
    name: 'Dr. Amelia Hill',
    image: doc15,
    speciality: 'Child Psychologist',
    degree: 'PhD in Child Psychology',
    experience: '1 Year',
    about: 'Works with children and adolescents to support emotional development, confidence, and social skills.',
    fees: 30,
    address: {
      line1: '37th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
]
