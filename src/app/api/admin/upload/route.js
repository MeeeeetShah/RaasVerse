import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifySuperAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    // 1. Verify Super Admin session
    const admin = await verifySuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 401 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            'Cloudinary credentials are not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file.',
          missingConfig: true
        },
        { status: 400 }
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });

    const formData = await request.formData();
    const file = formData.get('file');
    // Folder categorization: 'banners' | 'venues' | 'passes' | 'branding'
    const category = (formData.get('folder') || formData.get('category') || 'banners').toLowerCase().trim();
    const allowedCategories = ['banners', 'venues', 'passes', 'branding'];
    const safeCategory = allowedCategories.includes(category) ? category : 'banners';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided in request.' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save a local copy in public/RaasVerse/<category>/ for backup
    try {
      const localDir = path.join(process.cwd(), 'public', 'RaasVerse', safeCategory);
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      fs.writeFileSync(path.join(localDir, safeFileName), buffer);
    } catch (localErr) {
      console.warn('Local backup save skipped:', localErr.message);
    }

    // Upload to dedicated Cloudinary folder under RaasVerse/
    const targetFolder = `RaasVerse/${safeCategory}`;

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: targetFolder,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url || uploadResult.url,
      public_id: uploadResult.public_id,
      folder: targetFolder,
      category: safeCategory,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image to Cloudinary.' },
      { status: 500 }
    );
  }
}
