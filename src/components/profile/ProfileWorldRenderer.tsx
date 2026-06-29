"use client";

import { useMemo, useState } from "react";
import type { ProfileWorldData } from "@/lib/queries/profile-world";
import type { RelicBuildConfig } from "@/lib/profile/relic-config";
import { relicThemeToCssVars } from "@/lib/profile/relic-config";
import { ProfileWorldView } from "@/components/profile/ProfileWorldView";
import {
  ProfileWorldSafetyControls,
  useProfileWorldSafetyClasses,
} from "@/components/profile/ProfileWorldSafetyControls";

interface ProfileWorldRendererProps {
  world: ProfileWorldData;
  relicConfig?: RelicBuildConfig | null;
  showEditLinks?: boolean;
  isPreview?: boolean;
  isPublicView?: boolean;
}

export function ProfileWorldRenderer({
  world,
  relicConfig,
  showEditLinks = false,
  isPreview = false,
  isPublicView = false,
}: ProfileWorldRendererProps) {
  const [readable, setReadable] = useState(false);
  const [noEffects, setNoEffects] = useState(false);

  const config = relicConfig ?? null;
  const cssVars = useMemo(
    () => (config ? relicThemeToCssVars(config.theme) : {}),
    [config],
  );

  const shellClass = useProfileWorldSafetyClasses(readable, noEffects);
  const layoutClass = config ? `layout-${config.layout}` : "layout-standard_dossier";

  const hiddenModules = useMemo(() => {
    if (!config) return new Set<string>();
    return new Set(
      config.modules.filter((m) => !m.visible).map((m) => m.type),
    );
  }, [config]);

  return (
    <div
      className={`${shellClass} ${layoutClass}`}
      data-profile-world="true"
      style={{
        ...cssVars,
        backgroundColor: config?.theme.background ?? world.backgroundColor ?? undefined,
      }}
    >
      {(isPublicView || !isPreview) && !showEditLinks ? (
        <ProfileWorldSafetyControls
          onReadableChange={setReadable}
          onEffectsChange={setNoEffects}
        />
      ) : null}
      <ProfileWorldView
        world={world}
        showEditLinks={showEditLinks}
        hiddenModules={hiddenModules}
        moduleTitles={
          config
            ? Object.fromEntries(
                config.modules
                  .filter((m) => m.title)
                  .map((m) => [m.type, m.title as string]),
              )
            : undefined
        }
        relicAccent={config?.theme.accent}
        compact={isPreview}
      />
    </div>
  );
}
