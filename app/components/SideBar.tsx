import {useTranslation} from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import {Form, Link, useLocation, useNavigate} from "@remix-run/react";
import {useProfile} from "~/context/ProfileContext";

export default function SideBar() {
  const { t } = useTranslation("sidebar");
  const navigate = useNavigate();
  const {profile}= useProfile();
  const displayName = profile?.displayName || profile?.email.split("@")[0];
  const avatar: string = profile?.avatarUrl || "/profile/default.jpg";
  const isGuest = !profile;

  const location = useLocation();
  const isStoriesPage = location.pathname === "/stories";
  return isStoriesPage ? (
    <div></div>
  ) : (
    <section
      className="user-card
      hidden md:flex lg:flex 
      flex-col items-center rounded-2xl p-8 bg-dark-beige w-full md:w-1/3 lg:w-1/2 h-full"
    >
      <div className="flex justify-between w-full h-10">
        <span className="cursor-pointer">
          <i className="text-2xl ri-notification-4-line"></i>{" "}
        </span>
        <span
          onClick={() => {
            navigate("/profile");
          }}
          className="cursor-pointer"
        >
          <i className="text-2xl ri-settings-4-line"></i>
        </span>
      </div>
      <img
        className="rounded-full w-20 h-20 border-solid border-4 border-beige mb-2"
        src={avatar}
        alt="user avatar"
      />
      {!isGuest && (
        <h3 className="text-2xl flex gap-1">
          <i
            onClick={() => {
              navigate("/profile");
            }}
            className="ri-1 ri-edit-circle-fill cursor-pointer text-zinc-700"
          ></i>
          {displayName}{" "}
          <i
            onClick={() => {
              navigate("/plans");
            }}
            className="ri-1 text-amber-500 ri-vip-crown-fill cursor-pointer"
          ></i>
        </h3>
      )}
      {isGuest && <h3 className="text-2xl mb-2">{t("guest")}</h3>}
      {isGuest && (
        <Link
          to={"/auth"}
          className="
          text-xl text-blue-400 font-bold uppercase mb-4
          border-solid border-2 border-blue-400 rounded-md px-2"
        >
          {t("common:sign-in")}
        </Link>
      )}
      <LanguageSwitcher />
      {!isGuest && (
        <Form method="post" action="/logout">
          <button className="mt-2">{t("common:logout")}</button>
        </Form>
      )}

      <section className="activity-box w-full h-40 bg-white rounded-xl p-4 my-4">
        <div className="flex justify-between w-full h-10">
          <h4 className="text-lg">{t("activity")}</h4>
          <span>
            <i className="ri-thumb-up-line mx-1"></i>
            {t("great-job")}
          </span>
        </div>
        <hr />
        <div className="my-2">
          <div className="flex justify-between">
            <i className="ri-macbook-line text-xl px-1"></i>
            <span>5 {t("lessons-completed")}</span>
          </div>
          <div className="flex justify-between">
            <i className="ri-book-read-line text-xl px-1"></i>
            <span>3 {t("quizes-completed")}</span>
          </div>
        </div>
      </section>
      <h4 className="w-full mb-2">{t("my-lessons")}</h4>
      <section className="flex overflow-y-scroll flex-col gap-2 w-full h-full">
        <div className="course-card w-full h-20 bg-red-200 rounded-xl p-4">
          <Link to="/courses/0">Arabic 101</Link>
        </div>
        <div className="course-card w-full h-20 bg-orange-200 rounded-xl p-4">
          <Link to="/courses/1">Arabic 201</Link>
        </div>
        <div className="course-card w-full h-20 bg-violet-200 rounded-xl p-4">
          <Link to="/courses/2">Arabic 301</Link>
        </div>
      </section>
    </section>
  );
}
