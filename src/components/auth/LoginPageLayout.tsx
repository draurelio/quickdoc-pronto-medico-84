
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserRound } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface LoginPageLayoutProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  loginForm: React.ReactNode;
  signupForm: React.ReactNode;
  loading?: boolean;
}

const LoginPageLayout: React.FC<LoginPageLayoutProps> = ({ 
  activeTab, 
  setActiveTab, 
  loginForm, 
  signupForm,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue-600"></div>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-medblue-100 to-medblue-50">
          <div className="flex flex-col items-center space-y-2">
            <UserRound className="h-12 w-12 text-medblue-600" />
            <CardTitle className="text-xl text-medblue-800 text-center">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center">
              Faça login ou crie uma nova conta para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 my-4 mx-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <CardContent>
              {loginForm}
            </CardContent>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <CardContent>
              {signupForm}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginPageLayout;
