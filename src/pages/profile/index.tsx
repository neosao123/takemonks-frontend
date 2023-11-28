// material-ui components
import { Container } from "@mui/material";
import dynamic from "next/dynamic";
// components
import AuthGuard from "src/guards/authGuard";
import Page from "src/components/page";

const Tabs = dynamic(() => import("src/components/_main/profile/profileTabs"));
const ProfileCover = dynamic(
  () => import("src/components/_main/profile/profileCover")
);

// ----------------------------------------------------------------------

export default function UserProfile() {
  return (
    <AuthGuard>
      <Page title="User Profile | COMMERCEHOPE" canonical="profile">
        <ProfileCover />
        <Container maxWidth={"lg"}>
          <Tabs />
        </Container>
      </Page>
    </AuthGuard>
  );
}
