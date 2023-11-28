import PropTypes from "prop-types";
import { useRouter } from "next/router";
// redux
import { useSelector } from "react-redux";
// routes
import { PATH_PAGE } from "../routes/paths";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ ...props }) {
  const { children } = props;
  const { push, query } = useRouter();
  // type error
  const { isAuthenticated } = useSelector(({ user }: { user: any }) => user);

  if (isAuthenticated) {
    push((query?.redirect as string) || PATH_PAGE.root);
  }

  return children;
}
