import { useRef } from "react";
import AnimationWrapper from "../common/Page-animation";
import InputBox from "../components/Input.component";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/api";

const ChangePwdPage = () => {
  const changePasswordForm = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(changePasswordForm.current);
    const formData = Object.fromEntries(form.entries());
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword) return toast.error("Fill all the inputs");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    e.target.setAttribute("disabled", true);
    const loadingToast = toast.loading("Updating...");

    try {
      await api.post("/settings/change-password", { currentPassword, newPassword, confirmPassword });
      toast.dismiss(loadingToast);
      e.target.removeAttribute("disabled");
      toast.success("Password updated successfully");
      changePasswordForm.current.reset();
    } catch ({ response }) {
      toast.dismiss(loadingToast);
      e.target.removeAttribute("disabled");
      toast.error(response?.data?.error || "Failed to update password");
    }
  };

  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={changePasswordForm}>
        <h1 className="max-md:hidden">Change Password</h1>

        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox name="currentPassword" type="password" placeholder="Current Password" icon="fi-rr-unlock" />
          <InputBox name="newPassword" type="password" placeholder="New Password" icon="fi-rr-unlock" />
          <InputBox name="confirmPassword" type="password" placeholder="Confirm New Password" icon="fi-rr-unlock" />

          <button onClick={handleSubmit} className="btn-dark px-10" type="submit">
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePwdPage;