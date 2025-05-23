import ActivitiesHistoryUserProfile from "@/components/UserProfileComponents/AcitivitiesUserProfileComponents/activitiesHistoryUserProfile";
import ActivitiesUserCreateProfile from "@/components/UserProfileComponents/AcitivitiesUserProfileComponents/activitiesUserCreateProfile";
import HeroSection from "@/components/UserProfileComponents/heroSection";

function UserProfile() {
  return (
    <>
      {/* HeroSection is the top section of the user profile page */}
      <HeroSection />
      {/* ActivitiesUserCreateProfile and ActivitiesHistoryUserProfile are
      components that display the user's activities */}
      <ActivitiesUserCreateProfile />
      <ActivitiesHistoryUserProfile />
    </>
  );
}

export default UserProfile;
