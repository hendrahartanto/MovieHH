export const getStatusVariant = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "COMING_SOON":
      return "secondary";
    case "INACTIVE":
      return "outline";
    default:
      return "secondary";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Now Showing";
    case "COMING_SOON":
      return "Coming Soon";
    case "INACTIVE":
      return "Ended";
    default:
      return status;
  }
};
