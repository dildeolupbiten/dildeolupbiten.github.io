# Bayes Olasılığı

Bayes Olasılığı, başlangıçta oluşma olasılığı bilinen bir durumun çeşitli gözlemler altında, gözlemlerin birbirleriyle olan bağımlılık ve bağımsızlık durumlarına göre başlangıçta varsayılan sonucun oluşma olasılığının nasıl değiştiğini araştırmaya çalışan bir yaklaşımdır.

## Örnek-1

Örneğin, yazılan bütün metinlerin $0.75$'inin insanlar, kalan $0.25$'in ise robotlar tarafından yazıldığı biliniyor olsun.

$$
\begin{align}
P(H) = 0.25 \\
P(¬H) = 0.75
\end{align}
$$

Bir yazının bir insan tarafından mı yoksa bir yapay zeka tarafından mı yazıldığını tespit eden $E_1$ isminde bir aracımız olsun.

$E_1$ aracı için aşağıdaki sonuçları biliyor olalım:

- $P(E_1^+|H) = 0.90$: Bir robot tarafından üretilmiş bir metnin pozitif işaretlenme olasılığı.

- $P(E_1^+|¬H) = 0.15$: Bir insan tarafından üretilmiş bir metnin pozitif işaretlenme olasılığı.

$$
\begin{align}
P(E_1^+|H) = 0.90 \\
P(E_1^+|¬H) = 0.15
\end{align}
$$

Şimdi aşağıdaki olasılıkları bulmaya çalışalım:

1. $E_1$ aracı tarafından pozitif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^+) = ?
\end{align}
$$

2. $E_1$ aracı tarafından negatif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^-) = ?
\end{align}
$$

## Örnek-1 Çözüm

Önce verili bilgileri bir yazalım:

$$
\begin{align}
P(H) = 0.25 \\
P(¬H) = 0.75 \\
P(E_1^+|H) = 0.90 \\
P(E_1^+|¬H) = 0.15
\end{align}
$$

Verili bilgileri kullanarak $P(E_1^-|H)$ ve $P(E_1^-|¬H)$ olasılıklarını bulalım.

$$
\begin{align}
P(E_1^-|H) =& 1 - P(E_1^+|H) \\
=& 1 - 0.90 \\
=& 0.10 \\
P(E_1^-|¬H) =& 1 - P(E_1^+|¬H) \\
=& 1 - 0.15 \\
=& 0.85
\end{align}
$$

Şimdi soruda bizden istenen olasılıkları hesaplamaya geçebiliriz.

$$
\begin{align}
P(H|E_1^+) =& \frac{P(H) \times P(E_1^+|H)}{P(H) \times P(E_1^+|H) + P(¬H) \times P(E_1^+|¬H)} \\
=& \frac{0.25 \times 0.90}{0.25 \times 0.90 + 0.75 \times 0.15} \\
=& \frac{0.225}{0.225 + 0.1125} \\
=& \frac{0.225}{0.3375} \\
=& 0.6666666666666666 \\
=& 66.67 \\, \\%
\end{align}
$$

$$
\begin{align}
P(H|E_1^-) =& \frac{P(H) \times P(E_1^-|H)}{P(H) \times P(E_1^-|H) + P(¬H) \times P(E_1^-|¬H)} \\
=& \frac{0.25 \times 0.10}{0.25 \times 0.10 + 0.75 \times 0.85} \\
=& \frac{0.025}{0.025 + 0.6375} \\
=& \frac{0.025}{0.6625} \\
=& 0.03773584905660378 \\
=& 3.77 \\, \\%
\end{align}
$$

## Örnek-1 İçin Ekran Görüntüsü

<img width="1401" height="891" alt="Image" src="https://github.com/user-attachments/assets/0f543109-4b32-478d-a65a-96cc9c113d6c" />

## Örnek-2

Örnek-1'de yer alan $E_1$ isimli aracın yanına $E_2$ isimli ikinci bir araç tanımlayalım ve bu ikinci araç birinci aracımıza bağımlı olmasın.

$E_2$ aracı için aşağıdaki sonuçları biliyor olalım:

- $P(E_2^+|H) = 0.84$: Bir robot tarafından üretilmiş bir metnin pozitif işaretlenme olasılığı.

- $P(E_2^+|¬H) = 0.22$: Bir insan tarafından üretilmiş bir metnin pozitif işaretlenme olasılığı.

Bu durumda aşağıdaki olasılıkları bulmaya çalışalım:

1. Hem $E_1$ hem $E_2$ araçları tarafından pozitif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^+,E_2^+) = ?
\end{align}
$$

2. $E_1$ aracı tarafından pozitif, $E_2$ aracı tarafından da negatif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^+,E_2^-) = ?
\end{align}
$$

3. $E_1$ aracı tarafından negatif, $E_2$ aracı tarafından da pozitif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^-,E_2^+) = ?
\end{align}
$$

4. Hem $E_1$ hem $E_2$ araçları tarafından negatif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^-,E_2^-) = ?
\end{align}
$$

## Örnek-2 Çözüm

Yine önce verili bilgileri bir yazalım:

$$
\begin{align}
P(H) = 0.25 \\
P(¬H) = 0.75 \\
P(E_1^+|H) = 0.90 \\
P(E_1^+|¬H) = 0.15 \\
P(E_2^+|H) = 0.84 \\
P(E_2^+|¬H) = 0.22
\end{align}
$$

$P(E_1^-|H)$ ve $P(E_1^-|¬H)$ olasılıklarını Örnek-1'de zaten bulmuştuk. O halde verili bilgileri kullanarak sadece $P(E_2^-|H)$ ve $P(E_2^-|¬H)$ olasılıklarını bulalım. 

$$
\begin{align}
P(E_2^-|H) =& 1 - P(E_2^+|H) \\
=& 1 - 0.84 \\
=& 0.16 \\
P(E_2^-|¬H) =& 1 - P(E_2^+|¬H) \\
=& 1 - 0.22 \\
=& 0.78
\end{align}
$$

Artık soruda bizden istenen olasılıkları hesaplamaya geçebiliriz.

$$
\begin{align}
P(H|E_1^+,E_2^+) =& \frac{P(H) \times P(E_1^+|H) \times P(E_2^+|H)}{P(H) \times P(E_1^+|H) \times P(E_2^+|H) + P(¬H) \times P(E_1^+|¬H) \times P(E_2^+|¬H)} \\
=& \frac{0.25 \times 0.90 \times 0.84}{0.25 \times 0.90 \times 0.84 + 0.75 \times 0.15 \times 0.22} \\
=& \frac{0.189}{0.189 + 0.02475} \\
=& \frac{0.189}{0.21375} \\
=& 0.8842105263157894 \\
=& 88.42 \\, \\%
\end{align}
$$

$$
\begin{align}
P(H|E_1^+,E_2^-) =& \frac{P(H) \times P(E_1^+|H) \times P(E_2^-|H)}{P(H) \times P(E_1^+|H) \times P(E_2^-|H) + P(¬H) \times P(E_1^+|¬H) \times P(E_2^-|¬H)} \\
=& \frac{0.25 \times 0.90 \times 0.16}{0.25 \times 0.90 \times 0.16 + 0.75 \times 0.15 \times 0.78} \\
=& \frac{0.036}{0.036 + 0.08775} \\
=& \frac{0.036}{0.12375} \\
=& 0.29090909090909095 \\
=& 29.09 \\, \\%
\end{align}
$$

$$
\begin{align}
P(H|E_1^-,E_2^+) =& \frac{P(H) \times P(E_1^-|H) \times P(E_2^+|H)}{P(H) \times P(E_1^-|H) \times P(E_2^+|H) + P(¬H) \times P(E_1^-|¬H) \times P(E_2^+|¬H)} \\
=& \frac{0.25 \times 0.10 \times 0.84}{0.25 \times 0.10 \times 0.84 + 0.75 \times 0.85 \times 0.22} \\
=& \frac{0.021}{0.021 + 0.14025} \\
=& \frac{0.021}{0.16124} \\
=& 0.1302406350781444 \\
=& 13.02 \\, \\%
\end{align}
$$

$$
\begin{align}
P(H|E_1^-,E_2^-) =& \frac{P(H) \times P(E_1^-|H) \times P(E_2^-|H)}{P(H) \times P(E_1^-|H) \times P(E_2^-|H) + P(¬H) \times P(E_1^-|¬H) \times P(E_2^-|¬H)} \\
=& \frac{0.25 \times 0.10 \times 0.16}{0.25 \times 0.10 \times 0.16 + 0.75 \times 0.85 \times 0.78} \\
=& \frac{0.004}{0.004 + 0.49725} \\
=& \frac{0.004}{0.50125} \\
=& 0.007980049875311722 \\
=& 0.8 \\, \\%
\end{align}
$$

## Örnek-2 İçin Ekran Görüntüsü

<img width="1401" height="891" alt="Image" src="https://github.com/user-attachments/assets/6fc9aa25-2084-4aab-8678-8e022dd62422" />

## Örnek-3

Bu örnekte ise yine $E_1$ ve $E_2$ isimlerinde iki aracımız olsun ama bu kez $E_2$ aracı $E_1$ aracına bağımlı olsun.

$E_2$ aracı için aşağıdaki sonuçları biliyor olalım:

- $P(E_2^+|H,E_1^+) = 0.95$: Bir robot tarafından üretilmiş ve $E_1$ aracı tarafından pozitif işaretlenmiş bir metnin pozitif işaretlenme olasılığı.

- $P(E_2^+|H,E_1^-) = 0.35$: Bir robot tarafından üretilmiş ve $E_1$ aracı tarafından negatif işaretlenmiş bir metnin pozitif işaretlenme olasılığı.

- $P(E_2^+|¬H,E_1^+) = 0.56$: Bir insan tarafından üretilmiş ve $E_1$ aracı tarafından pozitif işaretlenmiş bir metnin pozitif işaretlenme olasılığı.

- $P(E_2^+|¬H,E_1^-) = 0.45$: Bir insan tarafından üretilmiş ve $E_1$ aracı tarafından negatif işaretlenmiş bir metnin pozitif işaretlenme olasılığı.

Bu örnekte de yine Örnek-2'deki olasılıkları bulmaya çalışacağız:

1. Hem $E_1$ hem $E_2$ araçları tarafından pozitif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^+,E_2^+) = ?
\end{align}
$$

2. $E_1$ aracı tarafından pozitif, $E_2$ aracı tarafından da negatif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^+,E_2^-) = ?
\end{align}
$$

3. $E_1$ aracı tarafından negatif, $E_2$ aracı tarafından da pozitif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^-,E_2^+) = ?
\end{align}
$$

4. Hem $E_1$ hem $E_2$ araçları tarafından negatif işaretlenmiş bir metnin gerçekte robot üretimi olma olasılığı nedir?

$$
\begin{align}
P(H|E_1^-,E_2^-) = ?
\end{align}
$$

## Örnek-3 Çözüm

Yine önce verili bilgileri bir yazalım:

$$
\begin{align}
P(H) = 0.25 \\
P(¬H) = 0.75 \\
P(E_1^+|H) = 0.90 \\
P(E_1^+|¬H) = 0.15 \\
P(E_2^+|H,E_1^+) = 0.95 \\
P(E_2^+|H,E_1^-) = 0.35 \\
P(E_2^+|¬H,E_1^+) = 0.56 \\
P(E_2^+|¬H,E_1^-) = 0.45
\end{align}
$$

$P(E_1^-|H)$ ve $P(E_1^-|¬H)$ olasılıklarını Örnek-1'de zaten bulmuştuk. Şimdi, verili bilgileri kullanarak $P(E_2^-|H,E_1^+)$, $P(E_2^-|H,E_1^-)$, $P(E_2^-|¬H,E_1^+)$ ve $P(E_2^-|¬H,E_1^-)$ olasılıklarını bulalım. 

$$
\begin{align}
P(E_2^-|H,E_1^+) =& 1 - P(E_2^+|H,E_1^+) \\
=& 1 - 0.95 \\
=& 0.05 \\
P(E_2^-|H,E_1^-) =& 1 - P(E_2^+|H,E_1^-) \\
=& 1 - 0.35 \\
=& 0.65 \\
P(E_2^-|¬H,E_1^+) =& 1 - P(E_2^+|¬H,E_1^+) \\
=& 1 - 0.56 \\
=& 0.44 \\
P(E_2^-|¬H,E_1^-) =& 1 - P(E_2^+|¬H,E_1^-) \\
=& 1 - 0.45 \\
=& 0.55
\end{align}
$$

Artık soruda bizden istenen olasılıkları hesaplamaya geçebiliriz.

$$
\begin{align}
P(H|E_1^+,E_2^+) =& \frac{P(H) \times P(E_1^+|H) \times P(E_2^+|H,E_1^+)}{P(H) \times P(E_1^+|H) \times P(E_2^+|H,E_1^+) + P(¬H) \times P(E_1^+|¬H) \times P(E_2^+|¬H,E_1^+)} \\
=& \frac{0.25 \times 0.90 \times 0.95}{0.25 \times 0.90 \times 0.95 + 0.75 \times 0.15 \times 0.56} \\
=& \frac{0.21375}{0.21375 + 0.063} \\
=& \frac{0.21375}{0.27675} \\
=& 0.7723577235772358 \\
=& 77.24 \\, \\%
\end{align}
$$

$$
\begin{align}
P(H|E_1^+,E_2^-) =& \frac{P(H) \times P(E_1^+|H) \times P(E_2^-|H,E_1^+)}{P(H) \times P(E_1^+|H) \times P(E_2^-|H,E_1^+) + P(¬H) \times P(E_1^+|¬H) \times P(E_2^-|¬H,E_1^+)} \\
=& \frac{0.25 \times 0.90 \times 0.05}{0.25 \times 0.90 \times 0.05 + 0.75 \times 0.15 \times 0.44} \\
=& \frac{0.01125}{0.01125 + 0.0495} \\
=& \frac{0.01125}{0.06075} \\
=& 0.18518518518518517 \\
=& 18.52 \\, \\%
\end{align}
$$

$$
\begin{align}
P(H|E_1^-,E_2^+) =& \frac{P(H) \times P(E_1^-|H) \times P(E_2^+|H,E_1^-)}{P(H) \times P(E_1^-|H) \times P(E_2^+|H,E_1^-) + P(¬H) \times P(E_1^-|¬H) \times P(E_2^+|¬H,E_1^-)} \\
=& \frac{0.25 \times 0.10 \times 0.35}{0.25 \times 0.10 \times 0.35 + 0.75 \times 0.85 \times 0.45} \\
=& \frac{0.00875}{0.00875 + 0.286875} \\
=& \frac{0.00875}{0.295625} \\
=& 0.02959830866807611 \\
=& 2.96 \\, \\%
\end{align}
$$

$$
\begin{align}
P(H|E_1^-,E_2^-) =& \frac{P(H) \times P(E_1^-|H) \times P(E_2^-|H,E_1^-)}{P(H) \times P(E_1^-|H) \times P(E_2^-|H,E_1^-) + P(¬H) \times P(E_1^-|¬H) \times P(E_2^-|¬H,E_1^-)} \\
=& \frac{0.25 \times 0.10 \times 0.65}{0.25 \times 0.10 \times 0.65 + 0.75 \times 0.85 \times 0.55} \\
=& \frac{0.01625}{0.01625 + 0.350625} \\
=& \frac{0.01625}{0.366875} \\
=& 0.044293015332197615 \\
=& 4.43 \\, \\%
\end{align}
$$


## Örnek-3 İçin Ekran Görüntüsü

<img width="1401" height="891" alt="Image" src="https://github.com/user-attachments/assets/f4512298-c4b6-4d71-8f5b-64567c36299a" />
