import { forwardRef, type AnchorHTMLAttributes } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";

type BasicLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  // extra props go here
};

const BasicLinkComponent = forwardRef<HTMLAnchorElement, BasicLinkProps>(
  ({ className, ...props }, ref) => {
    return <a ref={ref} {...props} className={className} />;
  }
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const NavLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return (
    <CreatedLinkComponent
      activeProps={{ className: "active-nav-link" }}
      preload={"intent"}
      {...props}
    />
  );
};