<template>
  <div>
    <s-page title="Shopify App Module - Playground">
      <s-section heading="Test">
        <s-stack direction="vertical" gap="large">
          <s-box border="base" border-radius="base" padding="base">
            <s-stack direction="block" gap="base" padding="base">
              <s-text as="h2" variant="headingMd">
                Module Configuration
              </s-text>
              <s-text
                >API Key: {{ config.public.shopifyEmbedded.apiKey }}</s-text
              >
              <s-text
                >App URL: {{ config.public.shopifyEmbedded.appUrl }}</s-text
              >
            </s-stack>
            <s-divider />
            <s-stack direction="block" gap="badse" padding="base">
              <s-text as="h2" variant="headingMd"> Polaris Status </s-text>
              <s-stack v-if="!cdnPolarisReady" direction="inline">
                <s-spinner size="small" />
                <s-text>Polaris status check...</s-text>
              </s-stack>
              <s-stack v-else direction="inline">
                <s-icon type="check-circle-filled" tone="success" />
                <s-text tone="success"> Loaded </s-text>
              </s-stack>
            </s-stack>
            <s-divider />
            <s-stack direction="block" gap="badse" padding="base">
              <s-text as="h2" variant="headingMd"> Polaris Status </s-text>
              <s-stack v-if="!cdnAppBridgeReady" direction="inline">
                <s-spinner size="small" />
                <s-text>App Bridge status check...</s-text>
              </s-stack>
              <s-stack v-else direction="inline">
                <s-icon type="check-circle-filled" tone="success" />
                <s-text tone="success"> Loaded </s-text>
              </s-stack>
            </s-stack>
            <s-divider />
            <s-stack direction="block" gap="badse" padding="base">
              <s-text as="h2" variant="headingMd"> Shop Info (GraphQL) </s-text>
              <template v-if="!apiData">
                <s-button
                  :disabled="!cdnAppBridgeReady || !cdnPolarisReady"
                  @click="_getData"
                >
                  Get data from API
                </s-button>
              </template>
              <template v-else>
                <s-text>
                  <strong>Shop Name:</strong>
                  {{ apiData.data.shop.name }}
                </s-text>
                <s-text>
                  <strong>Email:</strong> {{ apiData.data.shop.email }}
                </s-text>
                <s-text>
                  <strong>Domain:</strong>
                  {{ apiData.data.shop.myshopifyDomain }}
                </s-text>
                <s-text>
                  <strong>Plan:</strong>
                  {{ apiData.data.shop.plan.displayName }}
                </s-text>
              </template>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>
    </s-page>
  </div>
</template>

<script setup lang="ts">
// Use composables
const config = useRuntimeConfig();

// Prepare data refs
const cdnAppBridgeReady = ref(false);
const cdnPolarisReady = ref(false);
const apiData = ref(undefined);

// Check if CDN scripts are correctly is loaded
onMounted(() => {
  const interval = setInterval(() => {
    if (window?.polaris) {
      cdnPolarisReady.value = true;
    }

    if (window?.shopify) {
      cdnAppBridgeReady.value = true;
    }
  }, 100);
  setTimeout(() => clearInterval(interval), 5000);
});

// Prepare methods
const _getData = async () => {
  const api = $fetch.create({
    retry: 1,
    retryStatusCodes: [401],
    async onRequest({ options }) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${await window.shopify.idToken()}`);
      options.headers = headers;
    },
  });
  apiData.value = await api("/api/test");
};
</script>
