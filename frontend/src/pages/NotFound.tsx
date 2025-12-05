import {Link} from "react-router";

export function NotFound() {
  return (
    <>
      <span>Not found</span>
      <Link to="/parking">Parking view</Link>
    </>
  );
}
