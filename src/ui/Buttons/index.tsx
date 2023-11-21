import { Button, Link as LinkNextUI } from '@nextui-org/react';

export const PrimaryButton = props => {
  const { children } = props;
  return (
    <Button
      color="primary"
      className="w-full p-10 text-xl font-bold rounded-xl"
      type="submit"
    >
      {children}
    </Button>
  );
};

export const Link = props => {
  return (
    <LinkNextUI
      className={`text-sm font-semibold ${props.className}`}
      {...props}
    />
  );
};

// export const LinkButton = props => {
//   const { children } = props;
//   return (
//     <Button color="secondary" className="w-full p-8 text-xl" type="button">
//       {children}
//     </Button>
//   );
// };
