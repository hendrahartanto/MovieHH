type LayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center">
        <div>tes</div>
        <div className="mx-auto">{children}</div>
      </div>
    </>
  );
};
