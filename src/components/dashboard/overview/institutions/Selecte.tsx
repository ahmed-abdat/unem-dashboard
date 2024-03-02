"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { optionType } from "@/constant/filiers";
import { useState } from "react";

export function SelecteInstitution({
  value,
  setValue,
  options,
  isSpeciality = false,
}: {
  value: optionType;
  setValue: React.Dispatch<
    React.SetStateAction<optionType>
  >;
  options: optionType[];
  isSpeciality?: boolean;
}) {
  const [open, setOpen] = useState(false);
  //   const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full text-white bg-btn-hover hover:bg-green-2 hover:text-gray-200 transition-all shadow-option justify-between h-10 mt-4 font-semibold font-rb text-base"
          aria-label="choose your speciality"
        >
          {value
            ? isSpeciality ? options.find((option) => option.content.toUpperCase() === value.content.toUpperCase())?.content.toUpperCase()
            : options.find((option) => option.content === value.content)?.content
            : "إختر الكلية..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[90%] mx-auto font-medium font-rb text-base">
        <Command className="w-full font-medium font-rb text-base">
          <CommandInput
            placeholder="البحث عن الكلية ..."
            className="h-10 w-full font-medium font-rb text-sm"
          />
          <CommandEmpty className="font-medium font-rb text-base p-2 text-white">
            لم يتم إيجاد الكلية
          </CommandEmpty>
          <CommandGroup className="font-medium font-rb text-base">
            {options.map((option) => (
              <CommandItem
                className="font-medium font-rb text-base"
                key={option.content}
                value={option.content}
                onSelect={(currentValue) => {
                  
                  const selectedOption = options.find((option) => {
                    if(isSpeciality) {
                      return option.content.trim() === currentValue.trim().toUpperCase();
                    }
                    
                    return option.content === currentValue
                  });     
                  console.log( options.find((op) => op.content.trim() === currentValue.trim()) ,currentValue , 'selectedOption');
                  if(currentValue !== value.content && selectedOption) {
                    setValue(selectedOption);
                  } else {
                    setValue({content: "", url: ""});
                  }            
                  setOpen(false);
                }}
              >
                {option.content}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value.content === option.content ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
