import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "group relative bg-gradient-to-b from-[#3A3A3C] to-[#1C1C1E] text-white shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.3)] border border-[#2C2C2E] hover:shadow-[0_12px_28px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 duration-300",
        secondary:
          "bg-transparent text-[#1D1D1F] border border-[#E5E5EA] hover:bg-[#E5E5EA]/50 hover:border-[#D1D1D6] duration-200",
        accent:
          "bg-gradient-to-b from-[#007AFF] to-[#0062CC] text-white shadow-[0_4px_12px_rgba(0,122,255,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(0,122,255,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 duration-300",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "w-10 h-10 p-0 bg-gradient-to-b from-[#3A3A3C] to-[#1C1C1E] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] border border-[#2C2C2E] hover:shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 duration-300",
      },
      size: {
        default: "h-11 px-8 py-3",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  withSparkles?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, withSparkles = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? children : (
          <>
            {children}
            {withSparkles && variant === 'default' && (
              <Sparkles 
                size={16} 
                className="ml-2 text-white/70 group-hover:text-white group-hover:rotate-12 transition-all duration-300" 
              />
            )}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
