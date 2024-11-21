export const handlePostRequest = (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data) {
    return res.status(400).json({ is_success: false, message: "Missing data" });
  }

  const numbers = [];
  const alphabets = [];
  let highestLowercase = null;

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (typeof item === "string" && item.length === 1) {
      alphabets.push(item);

      if (
        item === item.toLowerCase() &&
        (!highestLowercase || item > highestLowercase)
      ) {
        highestLowercase = item;
      }
    }
  });

  const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const hasPrime = numbers.some((num) => isPrime(Number(num)));

  let fileValid = false,
    fileMimeType = null,
    fileSizeKb = null;

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");

      fileMimeType = getMimeType(buffer);
      fileSizeKb = (buffer.length / 1024).toFixed(2);
      fileValid = !!fileMimeType;
    } catch {
      fileValid = false;
    }
  }

  res.status(200).json({
    is_success: true,
    user_id: "samarjeet_singh_kheda_25092003",
    email: "samarjeetkheda210476@acropolis.in",
    roll_number: "0827CS211207",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: hasPrime,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKb,
  });
};

export const handleGetRequest = (req, res) => {
  res.status(200).json({ operation_code: 1 });
};

const getMimeType = (buffer) => {
  const signatures = {
    "89504E47": "image/png",
    FFD8FF: "image/jpeg",
    25504446: "application/pdf",
  };

  const hexSignature = buffer.toString("hex", 0, 4).toUpperCase();
  return signatures[hexSignature] || null;
};
