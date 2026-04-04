export const getTheme = (theme) => ({
    bg: theme === "dark" ? "bg-red-500" : "bg-blue-500",
    card: theme === "dark" ? "bg-[#2c1b12]" : "bg-gray-100",
    border: theme === "dark" ? "border-amber-800/40" : "border-blue-200",
    text: theme === "dark" ? "text-amber-100" : "text-slate-900",
    subtext: theme === "dark" ? "text-amber-300" : "text-blue-600",
    accent: theme === "dark" ? "text-blue-400" : "text-blue-500",
    badge:
        theme === "dark"
            ? "bg-blue-500/10 text-amber-400 border-amber-500/20"
            : "bg-blue-500/10 text-blue-500 border-blue-300",
});