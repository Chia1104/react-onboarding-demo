"use client";

import { useState } from "react";
import { Onboarding, OnboardingStep } from "@/components/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const onboardingSteps = [
    {
      title: "歡迎使用",
      content: "這是我們應用的主頁。點擊「開始使用」按鈕來開始您的旅程。",
    },
    {
      title: "功能介紹",
      content: "這裡是我們的主要功能區域，您可以在這裡執行各種操作。試試點擊這些按鈕！",
    },
    {
      title: "設置選項",
      content: "在這裡，您可以自定義應用的各種設置。試著輸入您的用戶名和郵箱。",
    },
    {
      title: "完成",
      content: "恭喜！您已經了解了基本使用方法。點擊完成開始使用吧！",
    },
  ];

  const handleComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">我的應用</h1>

      <Onboarding steps={onboardingSteps} enabled={showOnboarding} onComplete={handleComplete}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <OnboardingStep>
              <Button className="w-full" onClick={() => setShowOnboarding(true)}>
                開始使用
              </Button>
            </OnboardingStep>
            <OnboardingStep>
              <Card>
                <CardHeader>
                  <CardTitle>主要功能區域</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>這裡是應用的核心功能，您可以在這裡執行各種操作。</p>
                  <div className="mt-4">
                    <Button variant="outline" className="mr-2" onClick={() => alert("功能 1 已啟動！")}>
                      功能 1
                    </Button>
                    <Button variant="outline" onClick={() => alert("功能 2 已啟動！")}>
                      功能 2
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </OnboardingStep>
          </div>

          <div className="space-y-4">
            <OnboardingStep>
              <Card>
                <CardHeader>
                  <CardTitle>設置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p>test 2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </OnboardingStep>
            <OnboardingStep>
              <Button className="w-full" variant="outline" onClick={handleComplete}>
                完成設置
              </Button>
            </OnboardingStep>
          </div>
        </div>
      </Onboarding>
    </div>
  );
}
