
import { UserProfile } from '@/app/interfaces/user';

export const getProfileAssets = (profile: UserProfile | null | undefined) => {
    const gender = profile?.gender;

    // Avatar Logic
    let avatar = '/svg/us.svg';
    if (profile?.avatar) {
        avatar = profile.avatar;
    } else if (gender === 'Male') {
        avatar = '/images/avatar_male.png';
    } else if (gender === 'Female') {
        avatar = '/images/avatar_female.png';
    } else {
        // Default Fallback
        avatar = '/images/avatar_male.png'; // Fallback to male or generic
    }

    // Cover Logic
    let cover = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop';
    if (profile?.coverImage) {
        cover = profile.coverImage;
    }

    return { avatar, cover };
};
