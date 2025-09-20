// Next.js assets configuration - all images are in public directory
// Function to handle basePath for Azure App Service deployment
const getAssetPath = (path) => {
  // For Azure App Service with basePath '/app/mindmeet'
  const basePath = process.env.NODE_ENV === 'production' ? '/app/mindmeet' : '';
  return `${basePath}${path}`;
};

export const assets = {
    appointment_img: getAssetPath('/appointment_img.png'),
    header_img: getAssetPath('/header_img.png'),
    group_profiles: getAssetPath('/group_profiles.png'),
    logo: getAssetPath('/logo.png'),
    chats_icon: getAssetPath('/chats_icon.svg'),
    verified_icon: getAssetPath('/verified_icon.svg'),
    info_icon: getAssetPath('/info_icon.svg'),
    profile_pic: getAssetPath('/profile_pic.png'),
    arrow_icon: getAssetPath('/arrow_icon.svg'),
    contact_image: getAssetPath('/contact_image.png'),
    about_image: getAssetPath('/about_image.png'),
    menu_icon: getAssetPath('/menu_icon.svg'),
    cross_icon: getAssetPath('/cross_icon.png'),
    dropdown_icon: getAssetPath('/dropdown_icon.svg'),
    upload_icon: getAssetPath('/upload_icon.png'),
    stripe_logo: getAssetPath('/stripe_logo.png'),
    razorpay_logo: getAssetPath('/razorpay_logo.png'),
    landing_img: getAssetPath('/landing_img.png'),
    title_logo: getAssetPath('/titlelogo.png'),

    about_bg_img: getAssetPath('/about.png'),

    clinical_psychology_img: getAssetPath('/clinical-psychology.png'),
    psychiatry_img: getAssetPath('/psychiatrist.png'),
    child_psychology_img: getAssetPath('/behaviour.png'),
    addition_pyschology_img: getAssetPath('/alcohol.png'),
    counseling_img: getAssetPath('/advisory.png'),
    marriage_img: getAssetPath('/marriage.png'),
    behavioral_img: getAssetPath('/mental-disorder.png'),



}

export const specialityData = [
  {
    speciality: 'Clinical Psychologist',
    image: assets.clinical_psychology_img
  },
  {
    speciality: 'Psychiatrist',
    image: assets.psychiatry_img
  },
  {
    speciality: 'Behavioral Therapist',
    image: assets.behavioral_img
  },
  {
    speciality: 'Counselor',
    image: assets.counseling_img
  },
  {
    speciality: 'Marriage Therapist',
    image: assets.marriage_img
  },
  {
    speciality: 'Child Psychologist',
    image: assets.child_psychology_img
  },
  {
    speciality: 'Addiction Counselor',
    image: assets.addition_pyschology_img
  }
]

