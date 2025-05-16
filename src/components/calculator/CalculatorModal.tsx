
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

type CalculatorOperation = '+' | '-' | '*' | '/';
type CalculatorState = {
  currentValue: string;
  previousValue: string;
  operation: CalculatorOperation | null;
  overwrite: boolean;
};

const CalculatorModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operation: null,
    overwrite: true,
  });

  const addDigit = (digit: string) => {
    if (calculatorState.overwrite) {
      setCalculatorState({
        ...calculatorState,
        currentValue: digit,
        overwrite: false,
      });
    } else {
      setCalculatorState({
        ...calculatorState,
        currentValue: calculatorState.currentValue + digit,
      });
    }
  };

  const handleOperation = (operation: CalculatorOperation) => {
    if (calculatorState.operation) {
      calculateResult();
    }

    setCalculatorState({
      ...calculatorState,
      operation,
      previousValue: calculatorState.currentValue,
      overwrite: true,
    });
  };

  const calculateResult = () => {
    if (!calculatorState.operation || !calculatorState.previousValue) return;

    const prev = parseFloat(calculatorState.previousValue);
    const current = parseFloat(calculatorState.currentValue);
    let result = 0;

    switch (calculatorState.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current !== 0) {
          result = prev / current;
        } else {
          return; // Prevent division by zero
        }
        break;
    }

    setCalculatorState({
      currentValue: String(result),
      previousValue: '',
      operation: null,
      overwrite: true,
    });
  };

  const clear = () => {
    setCalculatorState({
      currentValue: '0',
      previousValue: '',
      operation: null,
      overwrite: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[300px] p-4">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Calculadora
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-white rounded-md shadow-inner border border-gray-200">
          <div className="p-2 text-right h-12 text-2xl font-mono bg-gray-50 rounded-t-md border-b border-gray-200">
            {calculatorState.currentValue}
          </div>
          
          <div className="grid grid-cols-4 gap-1 p-2">
            {/* First row */}
            <Button 
              variant="outline" 
              className="h-12"
              onClick={clear}
            >
              C
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => setCalculatorState({
                ...calculatorState,
                currentValue: calculatorState.currentValue.startsWith('-') 
                  ? calculatorState.currentValue.substring(1) 
                  : '-' + calculatorState.currentValue
              })}
            >
              +/-
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => {
                const val = parseFloat(calculatorState.currentValue) / 100;
                setCalculatorState({
                  ...calculatorState,
                  currentValue: String(val)
                });
              }}
            >
              %
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "h-12",
                calculatorState.operation === '/' ? "bg-medblue-100" : ""
              )}
              onClick={() => handleOperation('/')}
            >
              ÷
            </Button>
            
            {/* Second row */}
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('7')}
            >
              7
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('8')}
            >
              8
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('9')}
            >
              9
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "h-12",
                calculatorState.operation === '*' ? "bg-medblue-100" : ""
              )}
              onClick={() => handleOperation('*')}
            >
              ×
            </Button>
            
            {/* Third row */}
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('4')}
            >
              4
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('5')}
            >
              5
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('6')}
            >
              6
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "h-12",
                calculatorState.operation === '-' ? "bg-medblue-100" : ""
              )}
              onClick={() => handleOperation('-')}
            >
              −
            </Button>
            
            {/* Fourth row */}
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('1')}
            >
              1
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('2')}
            >
              2
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => addDigit('3')}
            >
              3
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "h-12",
                calculatorState.operation === '+' ? "bg-medblue-100" : ""
              )}
              onClick={() => handleOperation('+')}
            >
              +
            </Button>
            
            {/* Fifth row */}
            <Button 
              variant="outline" 
              className="h-12 col-span-2"
              onClick={() => addDigit('0')}
            >
              0
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => {
                if (!calculatorState.currentValue.includes('.')) {
                  setCalculatorState({
                    ...calculatorState,
                    currentValue: calculatorState.currentValue + '.',
                    overwrite: false,
                  });
                }
              }}
            >
              .
            </Button>
            <Button 
              variant="default" 
              className="h-12 bg-medblue-500 text-white hover:bg-medblue-600"
              onClick={calculateResult}
            >
              =
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorModal;
