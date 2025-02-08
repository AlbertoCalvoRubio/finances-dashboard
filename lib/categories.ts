import { TRANSACTIONS } from "./transactions/types";

export const CATEGORY_MAP = {
  EXPENSE: {
    BEAUTY: {
      displayName: "Beauty",
      keywords: ["beauty", "cosmetics", "salon"],
      icon: "💄",
      color: "#F4A361",
    },
    CASH: {
      displayName: "Cash",
      keywords: ["cash", "withdrawal"],
      icon: "💵",
      color: "#264753",
    },
    CLOTHING: {
      displayName: "Clothing",
      keywords: ["clothing", "apparel", "fashion"],
      icon: "👗",
      color: "#E8C468",
    },
    ELECTRICITY: {
      displayName: "Electricity",
      keywords: ["electricity", "power"],
      icon: "⚡",
      color: "#E76E4F",
    },
    ELECTRONICS: {
      displayName: "Electronics",
      keywords: ["electronics", "gadgets", "devices"],
      icon: "📱",
      color: "#299D8F",
    },
    FUEL: {
      displayName: "Fuel",
      keywords: ["fuel", "gas station", "petrol"],
      icon: "⛽",
      color: "#FEA361",
    },
    GAS: {
      displayName: "Gas",
      keywords: ["gas", "utility"],
      icon: "🔥",
      color: "#E8C45E",
    },
    GIFTS: {
      displayName: "Gifts",
      keywords: ["gift", "present"],
      icon: "🎁",
      color: "#FF69B4",
    },
    HOME: {
      displayName: "Home",
      keywords: ["rent", "mortgage", "home"],
      icon: "🏠",
      color: "#F4AD61",
    },
    INTERNET: {
      displayName: "Internet",
      keywords: ["internet", "broadband"],
      icon: "🌐",
      color: "#03A1FC",
    },
    MEDICAL: {
      displayName: "Medical",
      keywords: ["medical", "doctor", "pharmacy"],
      icon: "⚕️",
      color: "#B03030",
    },
    MORTGAGE: {
      displayName: "Mortgage",
      keywords: ["mortgage", "home loan"],
      icon: "🏠",
      color: "#8B0000",
    },
    ONLINE_SERVICES: {
      displayName: "Online Services",
      keywords: ["online", "subscription", "streaming"],
      icon: "🌐",
      color: "#0000FF",
    },
    OTHER_EXPENSES: {
      displayName: "Other Expenses",
      keywords: ["miscellaneous", "others"],
      icon: "❓",
      color: "#808080",
    },
    PARKING_AND_TOLL: {
      displayName: "Parking and Toll",
      keywords: ["parking", "toll", "peaje"],
      icon: "🅿️",
      color: "#0FD1B7",
    },
    PHONE: {
      displayName: "Phone",
      keywords: ["phone", "mobile", "telecom"],
      icon: "📱",
      color: "#FF4500",
    },
    RENT_AND_PURCHASE: {
      displayName: "Rent and Purchase",
      keywords: ["rent", "purchase", "Keller"],
      icon: "🏠",
      color: "#2A2A2A",
    },
    RESTAURANT: {
      displayName: "Restaurant",
      keywords: ["restaurant", "dine", "food"],
      icon: "🍽️",
      color: "#FC5203",
    },
    SPORTS: {
      displayName: "Sports",
      keywords: ["sports", "fitness", "gym"],
      icon: "🏋️",
      color: "#FF5733",
    },
    SUPERMARKET: {
      displayName: "Supermarket",
      keywords: [
        "supermarket",
        "grocery",
        "mercadona",
        "lidl",
        "coop",
        "migros",
      ],
      icon: "🛒",
      color: "#03FC03",
    },
    TAXES: {
      displayName: "Taxes",
      keywords: ["tax", "taxes"],
      icon: "💰",
      color: "#FFD700",
    },
    TRANSFERS: {
      displayName: "Transfers",
      keywords: ["transfer", "bank transfer"],
      icon: "💳",
      color: "#4B0082",
    },
    TRANSPORT: {
      displayName: "Transport",
      keywords: ["transport", "bus", "metro", "train"],
      icon: "🚖",
      color: "#1CD10F",
    },
    VACATIONS: {
      displayName: "Vacations",
      keywords: ["vacation", "trip", "holiday"],
      icon: "✈️",
      color: "#F08C00",
    },
    VEHICLE_MAINTENANCE: {
      displayName: "Vehicle Maintenance",
      keywords: ["maintenance", "car repair", "vehicle"],
      icon: "🚗",
      color: "#FFEB3B",
    },
    WATER: {
      displayName: "Water",
      keywords: ["water", "utility"],
      icon: "💧",
      color: "#00BFFF",
    },
  },
  INCOME: {
    GIFTS_RECEIVED: {
      displayName: "Gifts Received",
      keywords: ["gift", "present"],
      icon: "🎁",
      color: "#FF69B4",
    },
    OTHER_INCOME: {
      displayName: "Other Income",
      keywords: ["miscellaneous income", "others"],
      icon: "❓",
      color: "#96B3AF",
    },
    RENTAL_INCOME: {
      displayName: "Rental Income",
      keywords: ["rental", "property income"],
      icon: "🏠",
      color: "#4682B4",
    },
    SALARY: {
      displayName: "Salary",
      keywords: ["salary", "paycheck", "income"],
      icon: "💼",
      color: "#008000",
    },
    TAX_REFUND: {
      displayName: "Tax Refund",
      keywords: ["refund", "tax refund"],
      icon: "💸",
      color: "#32CD32",
    },
  },
  EXCLUDED: {
    INVESTMENTS: {
      displayName: "Investments",
      keywords: ["investment", "dividends", "returns"],
      icon: "📈",
      color: "#26475D",
    },
  },
} as const;

export const CATEGORIES = [
  ...Object.entries(CATEGORY_MAP.EXPENSE),
  ...Object.entries(CATEGORY_MAP.INCOME),
  ...Object.entries(CATEGORY_MAP.EXCLUDED),
];

export type Category =
  | keyof typeof CATEGORY_MAP.EXPENSE
  | keyof typeof CATEGORY_MAP.INCOME
  | keyof typeof CATEGORY_MAP.EXCLUDED;

export function extractCategory(text: string, amount: number): Category {
  if (amount <= 0) {
    for (const [category, { keywords }] of Object.entries(
      CATEGORY_MAP.EXPENSE,
    )) {
      if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
        return category as Category;
      }
    }
  } else {
    for (const [category, { keywords }] of Object.entries(
      CATEGORY_MAP.INCOME,
    )) {
      if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
        return category as Category;
      }
    }
  }

  if (amount < 0) {
    return "OTHER_EXPENSES";
  } else {
    return "OTHER_INCOME";
  }
}

export function getCategoryKeyByDisplayName(displayName: string): Category {
  const category = CATEGORIES.find(([, category]) => {
    return category.displayName === displayName;
  });

  return category?.[0] as Category;
}

export function findCategoryByCategoryKey(categoryKey: string) {
  const category = CATEGORIES.find(([key]) => {
    return key === categoryKey;
  });

  return category?.[1];
}

export function getTypeFromCategory(category: string) {
  if (Object.keys(CATEGORY_MAP.EXPENSE).includes(category)) {
    return TRANSACTIONS.EXPENSE;
  } else if (Object.keys(CATEGORY_MAP.INCOME).includes(category)) {
    return TRANSACTIONS.INCOME;
  } else if (Object.keys(CATEGORY_MAP.EXCLUDED).includes(category)) {
    return TRANSACTIONS.EXCLUDED;
  } else {
    console.error(`Unknown category: ${category}`);
  }
}
