import {Form, json} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import {useProfile} from "~/context/ProfileContext";
import type {ActionFunctionArgs} from "@remix-run/node";
import {createSupabaseServerClient} from "~/services/upabase.server";
import {getSession} from "~/services/session.server";
import {Profile} from "~/models/Profile";

export async function action({request}: ActionFunctionArgs) {
  const {supabase} = createSupabaseServerClient(request);
  const formaData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));

  if (formaData.has('lang') && session.has('user')) {
    await supabase.from('profiles').update({
      locale: formaData.get('lang')
    }).match({user_id: session.get('user')['id']});

  }
  return json({lang: formaData.get('lang')});
}

const ProfilePage = () => {
  const { t } = useTranslation("profile");
  const profile: Profile | null = useProfile();
  const name = profile?.displayName || "";

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
