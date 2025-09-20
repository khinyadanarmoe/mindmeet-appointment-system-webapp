// Admin Next.js assets configuration - all images are in public directory
// Use a function to get the correct path based on environment
const getAssetPath = (path) => {
  // In production, assets will be served from the basePath
  const basePath = process.env.NODE_ENV === 'production' ? '/mindmeet/admin' : '';
  return `${basePath}${path}`;
};

export const assets = {
    add_icon: getAssetPath('/assets/add_icon.svg'),
    admin_logo: getAssetPath('/assets/admin_logo.png'),
    appointment_icon: getAssetPath('/assets/appointment_icon.svg'),
    cancel_icon: getAssetPath('/assets/cancel_icon.svg'),
    doctor_icon: getAssetPath('/assets/doctor_icon.svg'),
    upload_area: getAssetPath('/assets/upload_area.svg'),
    home_icon: getAssetPath('/assets/home_icon.svg'),
    patients_icon: getAssetPath('/assets/patients_icon.svg'),
    people_icon: getAssetPath('/assets/people_icon.svg'),
    list_icon: getAssetPath('/assets/list_icon.svg'),
    tick_icon: getAssetPath('/assets/tick_icon.svg'),
    appointments_icon: getAssetPath('/assets/appointments_icon.svg'),
    earning_icon: getAssetPath('/assets/earning_icon.svg'),
    logout_icon: getAssetPath('/assets/logout.svg'),
    logo: getAssetPath('/assets/logo.png'),
}
