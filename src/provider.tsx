import { NextUIProvider } from "@nextui-org/system";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "./layouts/default";

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return <NextUIProvider navigate={navigate}>
    <DefaultLayout>
    {children}
    </DefaultLayout>
  </NextUIProvider>;
}
