"use client"

import { useCurrency } from "../context/currency-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Coins } from "lucide-react"

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Coins className="h-4 w-4" />
          <span className="sr-only">Switch currency</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency("USD")}>
          USD
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("EUR")}>
          EUR
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("ALL")}>
          ALL
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 