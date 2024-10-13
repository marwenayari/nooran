import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useProfile } from "~/context/ProfileContext";
import { Profile } from "~/types";

const ProfilePage = () => {
  let { t } = useTranslation("profile");
  const profile: Profile | null = useProfile();
  const name = profile?.display_name || "";

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
            defaultValue={name}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{t("email")}: </label>
          <input
            className="p-2"
            type="email"
            id="email"
            name="email"
            defaultValue={name}
          />
        </div>
        <button type="submit">{t("common:save")}</button>
      </Form>
    </div>
  );
};

export default ProfilePage;
