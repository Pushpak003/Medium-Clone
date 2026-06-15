import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/Page-animation";
import Loader from "../components/ui/Loader";
import InputBox from "../components/Input.component";
import { updateProfileImg, updateUsername } from "../redux/authSlice";
import api from "../utils/api";

const profileDataStructure = {
  personal_info: { fullname: "", username: "", profile_img: "", bio: "" },
  account_info: { total_posts: 0, total_reads: 0 },
  social_links: {},
  joinedAt: "",
};

const EditProfilePage = () => {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();

  const bioLimit = 150;
  const editProfileForm = useRef();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);

  const { personal_info: { email, fullname, username, bio, profile_img }, social_links } = profile;

  useEffect(() => {
    api.post("/user/profile", { username: user.username })
      .then(({ data }) => {
        setProfile(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(editProfileForm.current);
    const formData = Object.fromEntries(form.entries());
    const { username, bio, youtube, facebook, twitter, github, instagram, website } = formData;

    if (username.length < 3) return toast.error("Username should be at least 3 characters");
    if (bio.length > bioLimit) return toast.error(`Bio should not exceed ${bioLimit} characters`);

    const x = toast.loading("Updating...");
    e.target.setAttribute("disabled", true);

    try {
      const { data } = await api.post("/settings/update-profile", {
        username, bio,
        social_links: { youtube, facebook, twitter, github, instagram, website },
      });

      if (user.username !== data.username) {
        dispatch(updateUsername(data.username));
      }

      toast.dismiss(x);
      e.target.removeAttribute("disabled");
      toast.success("Profile Updated! 😎");
    } catch ({ response }) {
      toast.dismiss(x);
      e.target.removeAttribute("disabled");
      toast.error(response?.data?.error || "Update failed");
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      const x = toast.loading("Uploading image...");
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setAvatar(data.secure_url);
      toast.dismiss(x);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageChange = async (e) => {
    e.preventDefault();
    if (!avatar) return toast.error("Choose a photo first");

    const x = toast.loading("Saving...");
    try {
      await api.post("/settings/update-profile-img", { url: avatar });
      toast.dismiss(x);
      dispatch(updateProfileImg(avatar));
      toast.success("Profile image updated");
    } catch (error) {
      toast.dismiss(x);
      console.error(error);
    }
  };

  return (
    <AnimationWrapper>
      {loading ? <Loader /> : (
        <form ref={editProfileForm}>
          <Toaster />
          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden">
                <img src={avatar ?? profile_img} alt="" />
                <input type="file" className="hidden" onChange={handleAvatarUpload} />
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Image
                </div>
              </label>
              <button type="button" onClick={handleImageChange} className="btn-light mt-5 max-lg:bg-center lg:w-full px-10">
                Upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <InputBox name="fullname" type="text" disabled value={fullname} placeholder="Full Name" icon="fi-rr-user" />
                <InputBox name="email" type="email" value={email} disabled placeholder="Email" icon="fi-rr-envelope" />
              </div>

              <InputBox type="text" name="username" value={username} placeholder="Username" icon="fi-rr-at" />
              <p className="text-dark-grey -mt-3">Username will be visible to all users</p>

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                placeholder="Bio"
                onChange={(e) => setCharactersLeft(bioLimit - e.target.value.length)}
              />
              <p className="mt-1 text-dark-grey">{charactersLeft} characters left</p>
              <p className="my-6 text-dark-grey">Add your socials below</p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key, i) => (
                  <InputBox
                    key={i}
                    name={key}
                    type="text"
                    value={social_links[key]}
                    placeholder="https://"
                    icon={`fi ${key !== "website" ? `fi-brands-${key}` : "fi-rr-globe"}`}
                  />
                ))}
              </div>

              <button onClick={handleSubmit} className="btn-dark w-auto px-10" type="submit">
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfilePage;