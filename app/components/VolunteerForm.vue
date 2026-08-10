<script setup lang="ts">
import {
  INDIAN_STATES_AND_UNION_TERRITORIES,
  VOLUNTEER_ROLES,
  type VolunteerRole,
} from '~/content/volunteer'

const REASON_WORD_LIMIT = 300

type VolunteerFormData = {
  age: string
  email: string
  fullName: string
  location: string
  phone: string
  reason: string
  role: VolunteerRole | ''
}

const form = reactive<VolunteerFormData>({
  age: '',
  email: '',
  fullName: '',
  location: '',
  phone: '',
  reason: '',
  role: '',
})

const showSubmissionNotice = ref(false)
const locationListId = useId()

const { wordCount: reasonWordCount, isOverLimit: reasonIsOverLimit } = useWordLimit(
  () => form.reason,
  REASON_WORD_LIMIT,
)

function handleSubmit() {
  if (reasonIsOverLimit.value) {
    return
  }

  showSubmissionNotice.value = true
}

watch(form, () => {
  showSubmissionNotice.value = false
}, { deep: true })
</script>

<template>
  <form
    class="volunteer-form"
    @submit.prevent="handleSubmit"
  >
    <div class="volunteer-form__intro">
      <p class="volunteer-form__eyebrow">Volunteer application</p>
      <p>Tell us how you would like to help make physics more accessible.</p>
      <p class="volunteer-form__required"><span aria-hidden="true">*</span> Required fields</p>
    </div>

    <div class="volunteer-form__fields">
      <label class="field">
        <span>Full name <span aria-hidden="true">*</span></span>
        <input
          v-model.trim="form.fullName"
          autocomplete="name"
          name="fullName"
          required
          type="text"
        >
      </label>

      <label class="field">
        <span>Email ID <span aria-hidden="true">*</span></span>
        <input
          v-model.trim="form.email"
          autocomplete="email"
          inputmode="email"
          name="email"
          required
          type="email"
        >
      </label>

      <label class="field">
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

      <label class="field">
        <span>Age <span aria-hidden="true">*</span></span>
        <input
          v-model="form.age"
          inputmode="numeric"
          max="120"
          min="1"
          name="age"
          required
          type="number"
        >
      </label>

      <label class="field field--wide">
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
    </div>

    <fieldset class="role-picker">
      <legend>How would you like to help? <span aria-hidden="true">*</span></legend>
      <p class="role-picker__hint">These roles are tentative and may evolve.</p>

      <div class="role-picker__options">
        <label
          v-for="role in VOLUNTEER_ROLES"
          :key="role.value"
          :class="['role-card', { 'role-card--selected': form.role === role.value }]"
        >
          <input
            v-model="form.role"
            name="role"
            required
            type="radio"
            :value="role.value"
          >
          <span class="role-card__marker" aria-hidden="true" />
          <span class="role-card__content">
            <strong>{{ role.label }}</strong>
            <span>{{ role.description }}</span>
            <small><b>Requirements:</b> {{ role.requirements }}</small>
          </span>
        </label>
      </div>
    </fieldset>

    <label class="field field--reason">
      <span>Why do you want to work with WIEMO? <span aria-hidden="true">*</span></span>
      <textarea
        v-model="form.reason"
        aria-describedby="reason-word-count"
        :aria-invalid="reasonIsOverLimit"
        name="reason"
        required
        rows="7"
      />
      <span
        id="reason-word-count"
        :class="['field__counter', { 'field__counter--error': reasonIsOverLimit }]"
        aria-live="polite"
      >
        {{ reasonWordCount }} / {{ REASON_WORD_LIMIT }} words
      </span>
    </label>

    <div class="volunteer-form__footer">
      <button
        class="button button--primary"
        :disabled="reasonIsOverLimit"
        type="submit"
      >
        Submit application
      </button>
      <p v-if="showSubmissionNotice" class="volunteer-form__notice" role="status">
        Your application is ready. Submission delivery will be connected once the volunteer workflow is finalised.
      </p>
    </div>
  </form>
</template>

<style scoped lang="scss">
.volunteer-form {
  @include form-shell;
}

.volunteer-form__intro {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 24px;
  align-items: end;
  color: var(--body-copy);

  p:not(.volunteer-form__eyebrow, .volunteer-form__required) {
    max-width: 640px;
  }
}

.volunteer-form__eyebrow,
.volunteer-form__required,
.role-picker__hint,
.field__counter {
  color: var(--mute);
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 1px;
}

.volunteer-form__eyebrow {
  grid-column: 1 / -1;
  color: var(--beam);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.volunteer-form__required {
  white-space: nowrap;
}

.volunteer-form__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.field {
  @include form-field;
}

.role-picker {
  border: 0;

  legend {
    color: var(--body-copy);
    font-size: 14px;
    font-weight: 500;
  }
}

.role-picker__hint {
  margin-top: 5px;
}

.role-picker__options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 15px;
}

.role-card {
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: $radius-medium;
  background: var(--panel-2);
  transition:
    border-color $transition-fast $transition-ease,
    background-color $transition-fast $transition-ease,
    transform $transition-fast $transition-ease;
  cursor: pointer;

  &:hover {
    border-color: var(--deep);
    transform: translateY(-2px);
  }

  &:focus-within {
    border-color: var(--beam);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--beam) 16%, transparent);
  }

  &--selected {
    border-color: var(--beam);
    background: color-mix(in srgb, var(--beam) 8%, var(--panel-2));
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
}

.role-card__marker {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  border: 1px solid var(--mute);
  border-radius: 50%;
  box-shadow: inset 0 0 0 4px var(--panel-2);
  background: transparent;
}

.role-card--selected .role-card__marker {
  border-color: var(--beam);
  background: var(--beam);
}

.role-card__content {
  display: grid;
  gap: 8px;

  strong {
    color: var(--ink);
    font-family: $font-display;
    font-size: 18px;
    line-height: 1.2;
  }

  > span {
    color: var(--body-copy);
    font-size: 13px;
    line-height: 1.55;
  }

  small {
    color: var(--mute);
    font-size: 11px;
    line-height: 1.5;
  }
}

.field--reason {
  position: relative;
}

.field__counter {
  justify-self: end;
}

.field__counter--error {
  color: var(--signal);
}

.volunteer-form__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }
}

.volunteer-form__notice {
  max-width: 620px;
  color: var(--body-copy);
  font-size: 13px;
}

@media (max-width: 900px) {
  .role-picker__options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: $breakpoint-small) {
  .volunteer-form {
    gap: 28px;
    padding: 22px;
  }

  .volunteer-form__intro,
  .volunteer-form__fields {
    grid-template-columns: 1fr;
  }

  .volunteer-form__required,
  .field--wide {
    grid-column: auto;
  }
}
</style>
