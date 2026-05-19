"use client";

interface BadgeProps {
  status: string;
  variant?: "book" | "member" | "transaction";
}

export default function Badge({ status, variant }: BadgeProps) {
  const getStyle = () => {
    if (variant === "book") {
      if (status === "available") return "bg-green-100 text-green-700";
      if (status === "issued") return "bg-blue-100 text-blue-700";
      return "bg-gray-100 text-gray-600";
    }
    if (variant === "member") {
      if (status === "active") return "bg-green-100 text-green-700";
      if (status === "suspended") return "bg-red-100 text-red-700";
      if (status === "expired") return "bg-gray-100 text-gray-600";
      return "bg-gray-100 text-gray-600";
    }
    if (variant === "transaction") {
      if (status === "issued") return "bg-blue-100 text-blue-700";
      if (status === "returned") return "bg-green-100 text-green-700";
      if (status === "overdue") return "bg-red-100 text-red-700";
      return "bg-gray-100 text-gray-600";
    }
    return "bg-gray-100 text-gray-600";
  };

  return (
    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize " + getStyle()}>
      {status}
    </span>
  );
}
