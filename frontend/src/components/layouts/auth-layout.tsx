type LayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center">
        <div className="mx-auto shadow py-7 px-10 rounded-md w-[350px]">
          {children}
        </div>
      </div>
    </>
  );
};
