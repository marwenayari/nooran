import { createContext, useContext } from "react";
import {Profile} from "~/models/Profile";
const ProfileContext = createContext<Profile | null>(null);
export const useProfile = () => useContext(ProfileContext);
export default ProfileContext;
