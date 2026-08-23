<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'

const description = 'Learn how WIEMO grew from a CERN Masterclass experience into a student-led initiative making particle physics accessible across Bengaluru.'

useSeoMeta({
  title: 'About Us',
  description,
  ogTitle: 'WIEMO | About Us',
  ogDescription: description,
  twitterTitle: 'WIEMO | About Us',
  twitterDescription: description,
})
</script>

<template>
  <main class="about-page">
    <section class="content-section">
      <div class="wrap about-intro">
        <p class="eyebrow">Who we are</p>
        <h1>About Us</h1>
        <p class="about-intro__name">{{ SITE_CONTENT.initiativeName }}</p>
        <div class="about-intro__copy">
          <p v-for="paragraph in SITE_CONTENT.about.whoWeAre" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
        <aside class="vision-readout">
          <span>Our vision</span>
          <p>{{ SITE_CONTENT.vision }}</p>
        </aside>
      </div>
    </section>

    <section class="content-section">
      <div class="wrap about-story">
        <header>
          <p class="eyebrow">Our story</p>
          <h2>From one question to a shared effort.</h2>
        </header>
        <div class="about-story__copy">
          <p
            v-for="paragraph in SITE_CONTENT.about.story"
            :key="paragraph.text"
            :class="{ 'about-story__turn': 'highlighted' in paragraph && paragraph.highlighted }"
          >
            {{ paragraph.text }}
          </p>
        </div>
      </div>
    </section>

    <section class="content-section about-mission">
      <div class="wrap">
        <header class="about-mission__header">
          <p class="eyebrow">Our mission</p>
          <h2>Access should not decide who gets to be curious.</h2>
        </header>
        <div class="about-mission__copy">
          <p v-for="paragraph in SITE_CONTENT.mission" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="wrap about-work">
        <header>
          <p class="eyebrow">What we do</p>
          <h2>Big ideas, made discussable.</h2>
          <p class="lede">{{ SITE_CONTENT.about.teachingApproach }}</p>
        </header>
        <ol class="topic-grid">
          <li v-for="(topic, index) in SITE_CONTENT.about.topics" :key="topic">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <strong>{{ topic }}</strong>
          </li>
        </ol>
      </div>
    </section>

    <section class="content-section">
      <div class="wrap about-team">
        <header>
          <p class="eyebrow">Our team</p>
          <h2>Built together.</h2>
        </header>
        <ul>
          <li v-for="member in SITE_CONTENT.about.team" :key="member.name">
            <span aria-hidden="true" />
            <strong>{{ member.name }}</strong>
            <small>{{ member.role }}</small>
            <p>{{ member.bio }}</p>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.eyebrow {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.about-intro {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 32px 80px;
  align-items: end;

  > .eyebrow,
  > h1,
  > .about-intro__name {
    grid-column: 1 / -1;
  }

  h1 {
    max-width: 900px;
    font-size: clamp(52px, 7vw, 94px);
    line-height: 0.9;
  }
}

.about-intro__name {
  max-width: 760px;
  color: var(--body-copy);
  font-family: $font-display;
  font-size: clamp(24px, 3vw, 40px);
  line-height: 1.1;
}

.about-intro__copy,
.about-story__copy,
.about-mission__copy {
  display: grid;
  gap: 22px;

  p {
    color: var(--body-copy);
    font-size: 18px;
    line-height: 1.85;
  }
}

.vision-readout {
  padding: 24px;
  border: 1px solid color-mix(in srgb, var(--beam) 28%, transparent);
  background: color-mix(in srgb, var(--atlas) 8%, var(--panel));

  span {
    color: var(--beam);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
  }

  p {
    margin-top: 12px;
    color: var(--core);
    font-family: $font-display;
    font-size: 24px;
    line-height: 1.25;
  }
}

.about-story {
  display: grid;
  grid-template-columns: minmax(260px, 0.75fr) minmax(0, 1.25fr);
  gap: clamp(48px, 8vw, 130px);
  align-items: start;

  > header {
    position: sticky;
    top: 128px;
  }

}

.about-story h2,
.about-mission h2,
.about-work h2,
.about-team h2 {
  margin-top: 18px;
  font-size: clamp(38px, 4.5vw, 64px);
  line-height: 0.96;
}

.about-story__turn {
  margin-block: 12px;
  padding: 22px 0 22px 24px;
  color: var(--core) !important;
  border-left: 1px solid var(--beam);
  font-family: $font-display;
  font-size: 30px !important;
  line-height: 1.2 !important;
}

.about-mission {
  background: color-mix(in srgb, var(--panel) 72%, transparent);

  .wrap {
    display: grid;
    grid-template-columns: minmax(260px, 0.75fr) minmax(0, 1.25fr);
    gap: clamp(48px, 8vw, 130px);
  }
}

.about-work {
  display: grid;
  gap: 56px;

  header { max-width: 760px; }
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
  list-style: none;

  li {
    display: grid;
    min-height: 150px;
    gap: 20px;
    align-content: space-between;
    padding: 24px;
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  span {
    color: var(--beam);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 1.2px;
  }

  strong {
    color: var(--ink);
    font-family: $font-display;
    font-size: 24px;
    font-weight: 500;
    line-height: 1.15;
  }
}

.about-team {
  display: grid;
  grid-template-columns: minmax(220px, 0.6fr) minmax(0, 1.4fr);
  gap: clamp(48px, 8vw, 120px);

  ul { list-style: none; }

  li {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr) auto;
    gap: 18px;
    align-items: center;
    padding-block: 22px;
    border-top: 1px solid var(--line);
  }

  li > span {
    width: 8px;
    height: 8px;
    border: 1px solid var(--beam);
    border-radius: 50%;
    box-shadow: 0 0 12px color-mix(in srgb, var(--beam) 46%, transparent);
  }

  strong {
    color: var(--ink);
    font-family: $font-display;
    font-size: 25px;
    font-weight: 500;
  }

  small {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  li p {
    grid-column: 2 / -1;
    max-width: 680px;
    color: var(--body-copy);
    font-size: 14px;
    line-height: 1.7;
  }
}

@media (max-width: 850px) {
  .about-intro,
  .about-story,
  .about-mission .wrap,
  .about-team {
    grid-template-columns: 1fr;
  }

  .about-story > header { position: static; }
  .topic-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .about-intro h1 { font-size: 42px; line-height: 0.96; }
  .about-story h2,
  .about-mission h2,
  .about-work h2,
  .about-team h2 { font-size: 34px; }

  .about-intro__copy p,
  .about-story__copy p,
  .about-mission__copy p { font-size: 16px; line-height: 1.72; }

  .about-story__turn { padding-left: 18px; font-size: 21px !important; }
  .vision-readout p { font-size: 20px; }
  .topic-grid { grid-template-columns: 1fr; }
  .about-team li { grid-template-columns: 20px 1fr; }
  .about-team small,
  .about-team li p { grid-column: 2; }
}
</style>
