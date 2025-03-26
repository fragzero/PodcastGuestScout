import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface SettingsProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Profile settings form schema
const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().optional(),
});

// Notification settings form schema
const notificationFormSchema = z.object({
  newCandidates: z.boolean().default(true),
  candidateUpdates: z.boolean().default(true),
  systemUpdates: z.boolean().default(false),
  emailDigest: z.boolean().default(true),
});

// Appearance settings form schema
const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  accentColor: z.enum(["blue", "green", "violet", "pink", "orange"]).default("blue"),
  fontScale: z.enum(["90%", "100%", "110%", "120%"]).default("100%"),
});

// API settings form schema
const apiFormSchema = z.object({
  apiKey: z.string().optional(),
  enableApi: z.boolean().default(false),
});

export default function Settings({ sidebarOpen, toggleSidebar }: SettingsProps) {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "John Doe",
      email: "john.doe@example.com",
      bio: "Podcast host and content creator",
    },
  });

  // Notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      newCandidates: true,
      candidateUpdates: true,
      systemUpdates: false,
      emailDigest: true,
    },
  });

  // Appearance form
  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "system",
      accentColor: "blue",
      fontScale: "100%",
    },
  });

  // API form
  const apiForm = useForm<z.infer<typeof apiFormSchema>>({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      apiKey: "",
      enableApi: false,
    },
  });

  // Form submission handlers
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profile updated",
      description: "Your profile settings have been updated.",
    });
    console.log(data);
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
    console.log(data);
  };

  const onAppearanceSubmit = (data: z.infer<typeof appearanceFormSchema>) => {
    toast({
      title: "Appearance settings updated",
      description: "Your appearance settings have been applied.",
    });
    console.log(data);
  };

  const onApiSubmit = (data: z.infer<typeof apiFormSchema>) => {
    toast({
      title: "API settings updated",
      description: "Your API settings have been saved.",
    });
    console.log(data);
  };

  return (
    <div className={`flex h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and manage your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            We'll use this email for notifications.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            A brief description about yourself.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="newCandidates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">New Candidates</FormLabel>
                              <FormDescription>
                                Receive notifications when new candidates are added.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="candidateUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Candidate Updates</FormLabel>
                              <FormDescription>
                                Receive notifications when candidates are updated.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="systemUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">System Updates</FormLabel>
                              <FormDescription>
                                Receive notifications about system updates.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="emailDigest"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Digest</FormLabel>
                              <FormDescription>
                                Receive weekly email summaries.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit">Save Preferences</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...appearanceForm}>
                  <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-6">
                    <FormField
                      control={appearanceForm.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose a theme for your interface.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={appearanceForm.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accent Color</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an accent color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="violet">Violet</SelectItem>
                              <SelectItem value="pink">Pink</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose a primary color for buttons and accents.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={appearanceForm.control}
                      name="fontScale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="90%">Small (90%)</SelectItem>
                              <SelectItem value="100%">Default (100%)</SelectItem>
                              <SelectItem value="110%">Large (110%)</SelectItem>
                              <SelectItem value="120%">Extra Large (120%)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Adjust the font size for better readability.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Apply Settings</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Settings */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Manage your API access and credentials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...apiForm}>
                  <form onSubmit={apiForm.handleSubmit(onApiSubmit)} className="space-y-6">
                    <FormField
                      control={apiForm.control}
                      name="enableApi"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable API Access</FormLabel>
                            <FormDescription>
                              Allow external applications to access your data through the API.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={apiForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input
                                {...field}
                                type="password"
                                readOnly
                                className="rounded-r-none"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-l-none"
                                onClick={() => {
                                  const newKey = Array.from({ length: 32 }, () => 
                                    Math.floor(Math.random() * 16).toString(16)
                                  ).join('');
                                  apiForm.setValue('apiKey', newKey);
                                  toast({
                                    title: "New API Key Generated",
                                    description: "Your API key has been regenerated.",
                                  });
                                }}
                              >
                                Generate
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Your API key is secret. Never share it publicly.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Save API Settings</Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <h3 className="text-lg font-medium mb-2">API Documentation</h3>
                <p className="text-sm text-neutral-500 mb-4">
                  Learn how to integrate with our API to access your podcast guest candidate data programmatically.
                </p>
                <Button variant="outline">View API Documentation</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}