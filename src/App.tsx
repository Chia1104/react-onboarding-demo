"use client";

import { useState } from "react";
import { Onboarding, OnboardingStep } from "@/components/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppWithOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const onboardingSteps = [
    {
      title: "欢迎使用",
      content: "这是我们应用的主页。点击这里开始您的旅程。",
    },
    {
      title: "功能介绍",
      content: "这里是我们的主要功能区域，您可以在这里执行各种操作。",
    },
    {
      title: "设置选项",
      content: "在这里，您可以自定义应用的各种设置。",
    },
    {
      title: "完成",
      content: "恭喜！您已经了解了基本使用方法。点击完成开始使用吧！",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">我的应用</h1>

      <Onboarding
        steps={onboardingSteps}
        enabled={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        defaultStep={1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <OnboardingStep>
              <Button className="w-full" onClick={() => setShowOnboarding(true)}>
                开始使用
              </Button>
            </OnboardingStep>
            <OnboardingStep>
              <Card>
                <CardHeader>
                  <CardTitle>主要功能区域</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>这里是应用的核心功能，您可以在这里执行各种操作。</p>
                  <div className="mt-4">
                    <Button variant="outline" className="mr-2">
                      功能 1
                    </Button>
                    <Button variant="outline">功能 2</Button>
                  </div>
                </CardContent>
              </Card>
            </OnboardingStep>
          </div>

          <div className="space-y-4">
            <OnboardingStep>
              <Card>
                <CardHeader>
                  <CardTitle>设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {/* <Label htmlFor="name">用户名</Label>
                      <Input id="name" placeholder="输入您的用户名" /> */}
                    </div>
                    <div className="space-y-2">
                      {/* <Label htmlFor="email">邮箱</Label>
                      <Input id="email" type="email" placeholder="输入您的邮箱" /> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </OnboardingStep>
            <OnboardingStep>
              <Button className="w-full" variant="outline">
                完成设置
              </Button>
            </OnboardingStep>
          </div>
        </div>
      </Onboarding>
    </div>
  );
}
