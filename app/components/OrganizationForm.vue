<script setup lang="ts">
import { INDIAN_STATES_AND_UNION_TERRITORIES } from '~/content/volunteer'
import { SITE_CONTENT } from '~/content/siteContent'

const PROPOSAL_WORD_LIMIT = 300

const form = reactive({
  organizationName: '',
  location: '',
  email: '',
  phone: '',
  proposal: '',
})

const showSubmissionNotice = ref(false)
const locationListId = useId()
const { wordCount: proposalWordCount, isOverLimit: proposalIsOverLimit } = useWordLimit(
  () => form.proposal,
  PROPOSAL_WORD_LIMIT,
)

function handleSubmit() {
  if (proposalIsOverLimit.value) return

  const subject = `Collaboration inquiry — ${form.organizationName}`
  const body = [
    `School or organisation: ${form.organizationName}`,
    `Location: ${form.location}`,
    `Email: ${form.email}`,
    `Phone number: ${form.phone}`,
    '',
    'Proposal or inquiry:',
    form.proposal,
  ].join('\n')

  showSubmissionNotice.value = true
  window.location.href = `${SITE_CONTENT.contact.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

watch(form, () => {
  showSubmissionNotice.value = false
}, { deep: true })
</script>

<template>
  <form class="organization-form" @submit.prevent="handleSubmit">
    <div class="organization-form__intro">
      <p class="organization-form__eyebrow">Partnership inquiry</p>
      <p>Tell us about your community and how you would like to work with WIEMO.</p>
      <p class="organization-form__required"><span aria-hidden="true">*</span> Required fields</p>
    </div>

    <div class="organization-form__fields">
      <label class="field field--wide">
        <span>School or organisation name <span aria-hidden="true">*</span></span>
        <input
          v-model.trim="form.organizationName"
          autocomplete="organization"
          name="organizationName"
          required
          type="text"
        >
      </label>

      <label class="field">
        <span>Location <span aria-hidden="true">*</span></span>
        <input
          v-model.trim="form.location"
          autocomplete="address-level1"
          :list="locationListId"
          name="location"
          placeholder="City, state or region"
          required
          type="text"
        >
        <datalist :id="locationListId">
          <option
            v-for="location in INDIAN_STATES_AND_UNION_TERRITORIES"
            :key="location"
            :value="location"
          />
        </datalist>
      </label>

      <label class="field">
        <span>Email <span aria-hidden="true">*</span></span>
        <input
          v-model.trim="form.email"
          autocomplete="email"
          inputmode="email"
          name="email"
          required
          type="email"
        >
      </label>

      <label class="field field--wide">
        <span>Phone number <span aria-hidden="true">*</span></span>
        <input
          v-model.trim="form.phone"
          autocomplete="tel"
          inputmode="tel"
          name="phone"
          required
          type="tel"
        >
      </label>

      <label class="field field--wide field--proposal">
        <span>Proposal or inquiry <span aria-hidden="true">*</span></span>
        <textarea
          v-model="form.proposal"
          aria-describedby="proposal-word-count"
          :aria-invalid="proposalIsOverLimit"
          name="proposal"
          placeholder="What would you like to make possible for your students or community?"
          required
          rows="8"
        />
        <span
          id="proposal-word-count"
          :class="['field__counter', { 'field__counter--error': proposalIsOverLimit }]"
          aria-live="polite"
        >
          {{ proposalWordCount }} / {{ PROPOSAL_WORD_LIMIT }} words
        </span>
      </label>
    </div>

    <div class="organization-form__footer">
      <button class="button button--primary" :disabled="proposalIsOverLimit" type="submit">
        Send inquiry
      </button>
      <p v-if="showSubmissionNotice" class="organization-form__notice" role="status">
        Your email app should open with this inquiry addressed to WIEMO.
      </p>
    </div>
  </form>
</template>

<style scoped lang="scss">
.organization-form {
  @include form-shell;
}

.organization-form__intro {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 24px;
  align-items: end;

  > p:not(.organization-form__eyebrow, .organization-form__required) {
    max-width: 600px;
    color: var(--body-copy);
  }
}

.organization-form__eyebrow,
.organization-form__required,
.field__counter {
  color: var(--mute);
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 1px;
}

.organization-form__eyebrow {
  grid-column: 1 / -1;
  color: var(--beam);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.organization-form__required { white-space: nowrap; }

.organization-form__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.field {
  @include form-field(190px);
}

.field__counter {
  justify-self: end;
  font-weight: 500;
}

// A blue-only palette has no danger hue, so the over-limit counter
// escalates through brightness and weight instead.
.field__counter--error {
  color: var(--core);
  font-weight: 700;
}

.organization-form__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }
}

.organization-form__notice {
  max-width: 620px;
  color: var(--body-copy);
  font-size: 13px;
}

@media (max-width: $breakpoint-small) {
  .organization-form {
    gap: 28px;
    padding: 22px;
  }

  .organization-form__intro,
  .organization-form__fields {
    grid-template-columns: 1fr;
  }

  .organization-form__required,
  .field--wide {
    grid-column: auto;
  }
}
</style>
