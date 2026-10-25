# Premium Skills & Agents — İnceleme Dalgası 1 (2026-10-25)

Bu dalda yalnız 825 iki satırlık, numaralandırılmış, belirli bir fuara/işe özgü yönergesi olmayan yer tutucu ajan tanımı silinmek üzere önerilir. Geri alma için ana dalın bu daldan önceki commit'i: `ee3d0676b7fa8c1f0a33be80bb7a3c8e89d10568`.

## İncelenen kök neden

- 7 squad x 100 kayıt = **700** genel rol tanımı. Her biri yalnız başlık ve aynı kalıp "fully-fledged expert" iddiasını içerir; araç, girdiler, çıktı, sınır durum, doğrulama veya kabul testi yoktur.
- global-fairground-venue-specialist-1..125 = **125** genel rol tanımı. Fuar merkezi adı, teknik yönetmelik maddesi, yükseklik, taşıyıcı hesap, etkinlik sınırlaması veya kaynak yoktur.
- Örnekler `squad1..7-*-agent-1.md` ve `global-fairground-venue-specialist-1-fellow.md` ayrı okunarak iki satırlık yapı doğrulanmıştır; kalanlar ayrıca ad/ölçü kalıbıyla sınırlandırılmıştır.

## Güvenlik ve kapsam

- Bu işlem yalnız `.agents/agents/` içindeki 825 aday dosyayı hedefler. **Plugin manifestleri, skills, yazılım kodu, Keychain, parolalar, şirket verileri, üretim/ana dal, başka GitHub depoları değiştirilmez.**
- Diğer 215 ajan tanımı ve 524 skill dosyası korunur. Bunların tümünün ileri seviye olduğu iddia edilmez; bağımlılık ve kalite incelemesi ayrıdır.
- Bu bir **taslak PR** olmalı. Canlı işe alma / plugin keşif testi, referans taraması ve kullanıcı gözden geçirmesi tamamlanmadan birleştirmeyin.

## Kalite eşiği (isim değil kanıt)

Bir uzman skill için: somut alan terimleri ve teknik karar ağacı; müşteri girdisi ile tasarımcının teknik kararı ayrımı; belirsizlik ve güvenlik sınırları; kurallı çıktı biçimi; negatif/test örnekleri; tenant/rol koruması ve kaynak/lisans doğrulaması gerekir. Sadece `Ultra/Max/Gold` ibaresi puan kazandırmaz.

## Korunması gereken uzman kaynakları

PlanicWorks `fair-stand-operations-master`, `saas-architecture-master`, `planicworks-ui-design-system`, `automated-testing-and-qa-master`; burada `exhibition-enterprise-domain-mastery` ve `brief-intake-wizard-fellow` gibi isimler **korunur fakat derinlik değerlendirmesi sürer**. Paketlenmiş AAS kopyaları bağımlılık sözleşmesi nedeniyle bu dalda deduplikasyona alınmamıştır.
