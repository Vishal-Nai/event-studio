import { redirect } from "next/navigation";

export default function CreateFramePage() {
  redirect("/frames?create=1");
}
