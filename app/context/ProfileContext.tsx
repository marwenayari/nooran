import { createContext, useContext } from "react";
const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);
export default ProfileContext;
