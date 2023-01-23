import specification from "./options/specification";
import content from "./options/content";
import design from "./options/design";
import development from "./options/development";

export const allOptions: any = {
  specification,
  content,
  design,
  development,
};

export const columns: {
  [key: string]: {
    title: string;
    width: string;
  };
} = {
  hours: {
    title: "Hours",
    width: "20%",
  },
  hourly: {
    title: "Hourly",
    width: "20%",
  },
  total: {
    title: "Total",
    width: "20%",
  },
  min_timeline: {
    title: "Min Weeks",
    width: "15%",
  },
  max_timeline: {
    title: "Max Weeks",
    width: "15%",
  },
};
