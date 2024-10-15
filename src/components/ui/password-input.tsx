import React, {useState} from 'react';
import {Input} from "@/components/ui/input.tsx";
import {Eye, EyeOff} from "lucide-react";
import {UseFormRegisterReturn} from "react-hook-form";

type PasswordInputProps = {
    id?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    value?: string;
    register?: UseFormRegisterReturn;
}

const PasswordInput = (props: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    return (
        <div className="relative w-full">
            <Input
                id={props.id}
                onChange={props.onChange}
                minLength={8}
                type={showPassword ? 'text' : 'password'}
                placeholder={props.placeholder}
                className={props.className}
                value={props.value}
                {...props.register}
                />
            <span onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                {showPassword ? <Eye/> : <EyeOff/>}
            </span>
        </div>
    );
};

export default PasswordInput;