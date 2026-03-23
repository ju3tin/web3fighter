"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Wallet,
  Bell,
  Shield,
  Palette,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Mail,
  AtSign,
  Globe,
  Twitter,
  MessageCircle,
  Eye,
  EyeOff,
  Trash2,
  Download,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const walletAddress = "7xKX...4mPq";
  const fullWalletAddress = "7xKXnR8vT3LmQ9pWz2FjY5hN6cBdA4mPq";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pb-20 pt-28">
        {/* Header */}
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account, wallet, and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent sm:flex sm:w-auto sm:gap-1 sm:bg-secondary/50 sm:p-1">
            <TabsTrigger
              value="profile"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your public profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground">
                      CK
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs">
                      <Palette className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="CryptoKnight"
                    className="max-w-md bg-secondary/50"
                  />
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    defaultValue="Crypto Knight"
                    className="max-w-md bg-secondary/50"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <div className="flex max-w-md items-center gap-2">
                    <Input
                      id="email"
                      type={showEmail ? "text" : "password"}
                      defaultValue="knight@crypto.com"
                      className="bg-secondary/50"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmail(!showEmail)}
                    >
                      {showEmail ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={3}
                    defaultValue="Web3Fighter champion since Season 1. Collecting legendary fighters and mastering combat moves."
                    className="w-full max-w-md rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    Social Links
                  </Label>
                  <div className="grid max-w-md gap-3">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Twitter username"
                        defaultValue="@cryptoknight"
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Discord username"
                        defaultValue="CryptoKnight#1234"
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Website URL"
                        defaultValue="https://cryptoknight.gg"
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Connected Wallet
                </CardTitle>
                <CardDescription>
                  Manage your Solana wallet connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Wallet */}
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono font-medium text-foreground">
                        {walletAddress}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Phantom Wallet
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Balance */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <p className="text-sm text-muted-foreground">SOL Balance</p>
                    <p className="text-2xl font-bold text-foreground">
                      24.5 SOL
                    </p>
                    <p className="text-sm text-muted-foreground">~$3,675 USD</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <p className="text-sm text-muted-foreground">NFT Holdings</p>
                    <p className="text-2xl font-bold text-foreground">47 NFTs</p>
                    <p className="text-sm text-muted-foreground">
                      Est. value: 156 SOL
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">
                    <Wallet className="mr-2 h-4 w-4" />
                    Switch Wallet
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History Link */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Transaction Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Auto-confirm small transactions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Skip confirmation for transactions under 0.1 SOL
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Priority fees
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use higher fees for faster confirmation
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose what updates you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Trading Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Trading</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">Item sold</p>
                        <p className="text-sm text-muted-foreground">
                          When someone purchases your NFT
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">Bid received</p>
                        <p className="text-sm text-muted-foreground">
                          When someone places a bid on your item
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">Outbid</p>
                        <p className="text-sm text-muted-foreground">
                          When someone outbids you on an auction
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">Auction ending soon</p>
                        <p className="text-sm text-muted-foreground">
                          15 minutes before auctions you bid on end
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Social Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Social</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">New follower</p>
                        <p className="text-sm text-muted-foreground">
                          When someone follows your profile
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">Mentions</p>
                        <p className="text-sm text-muted-foreground">
                          When someone mentions you in activity
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Game Notifications */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Game Updates</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">New drops</p>
                        <p className="text-sm text-muted-foreground">
                          When new fighters or moves are released
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">Season updates</p>
                        <p className="text-sm text-muted-foreground">
                          News about new seasons and events
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground">Price alerts</p>
                        <p className="text-sm text-muted-foreground">
                          When items on your watchlist change price
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control your profile visibility and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Public profile
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Allow others to view your profile and collection
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Show activity
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Display your purchases and sales in activity feed
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Show on leaderboard
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Appear in public rankings
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        Hide wallet balance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {"Don't show your SOL balance on your profile"}
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download my data
                </Button>
                <div className="h-px bg-border" />
                <div>
                  <h4 className="mb-2 font-medium text-destructive">
                    Danger Zone
                  </h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
