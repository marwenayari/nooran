import { FC } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";

interface UserProfile {
  username: string;
  email: string;
}

export const loader = async () => {
  const userProfile: UserProfile = {
    username: "marwen",
    email: "marwenayarimail@gmail.com",
  };
  return userProfile;
};

const Profile: FC = () => {
  let { t } = useTranslation("profile");
  const userProfile = useLoaderData<UserProfile>();

  return (
    <div className="profile-settings">
      <h1 className="text-3xl">{t("title")}</h1>
      <Form method="post">
        <div className="form-group">
          <label htmlFor="username">{t("username")}: </label>
          <input
            className="p-2"
            type="text"
            id="username"
            name="username"
            defaultValue={userProfile.username}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{t("email")}: </label>
          <input
            className="p-2"
            type="email"
            id="email"
            name="email"
            defaultValue={userProfile.email}
          />
        </div>
        <button type="submit">{t("common:save")}</button>
      </Form>
    </div>
  );
};

export default Profile;
