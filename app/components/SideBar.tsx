import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SideBar() {
  let { t } = useTranslation("sidebar");

  return (
    <div
      className="user-card
      hidden md:flex lg:flex 
      flex-col items-center rounded-2xl p-8 bg-dark-beige w-1/3 h-full"
    >
      <div className="flex justify-between w-full h-10">
        <span className="cursor-pointer">
          <i className="ri-notification-4-line"></i>{" "}
        </span>
        <span className="cursor-pointer">
          <i className="ri-settings-4-line"></i>
        </span>
      </div>
      <img
        className="rounded-full w-20 h-20"
        src="https://trello-members.s3.amazonaws.com/5b8acf1ffbad8c456f424e20/4113d92d0d92df6202eea4b541b35cca/50.png"
        alt=""
      />
      <h3 className="text-2xl">Marwen Ayari</h3>
      <LanguageSwitcher />
      <div className="activity-box w-full h-40 bg-white rounded-xl p-4 my-4">
        <div className="flex justify-between w-full h-10">
          <h4 className="text-lg">{t("activity")}</h4>
          <span>
            <i className="ri-thumb-up-line mx-1"></i>
            {t("great-job")}
          </span>
        </div>
        <hr />
        <div className="m-2">
          <div className="flex justify-between">
            <i className="ri-macbook-line text-xl px-1"></i>
            <span>5 {t("lessons-completed")}</span>
          </div>
          <div className="flex justify-between">
            <i className="ri-book-read-line text-xl px-1"></i>
            <span>3 {t("quizes-completed")}</span>
          </div>
        </div>
      </div>
      <h4 className="w-full mb-2">{t("my-lessons")}</h4>
      <div className="flex flex-col gap-2 w-full">
        <div className="course-card w-full h-20 bg-red-200 rounded-xl p-4">
          <h4>Arabic 101</h4>
        </div>
        <div className="course-card w-full h-20 bg-orange-200 rounded-xl p-4">
          <h4>Arabic 201</h4>
        </div>
        <div className="course-card w-full h-20 bg-violet-200 rounded-xl p-4">
          <h4>Arabic 301</h4>
        </div>
      </div>
    </div>
  );
}
