import React, { useState, useEffect, useRef } from "react";
import {
  Home, Bed, PoundSterling, MapPin,
  CheckCircle2, ShieldCheck, Zap, Car, 
  Info, ChevronRight, Layout, AlertCircle, X, Loader2, Upload
} from "lucide-react";
import uploadToCloudinary from "../../../utils/uploadToCloudinary";
import { ReactSortable } from 'react-sortablejs';

const ROOM_AMENITIES = [
  "single_bed","double_bed","ensuite_bathroom","desk","chair",
  "wardrobe","chest_of_drawers","mirror","tv","lockable_room","balcony"
];

const PROPERTY_AMENITIES = [
  "wifi","heating","air_conditioning","washing_machine","dryer",
  "dishwasher","fridge","freezer","microwave","oven","shared_kitchen",
  "cleaning_service","garden","parking","lift","security","cctv"
];

const FLOOR_OPTIONS = [
  "Ground Floor",
  "First Floor",
  "Second Floor",
  "Third Floor",
  "Fourth Floor",
  "Fifth Floor",
  "Sixth Floor+",
  "Basement",
  "Lower Ground"
];

const ROOM_SIZE_OPTIONS = [
  "Small (up to 100 sq ft)",
  "Medium (100-150 sq ft)",
  "Large (150-200 sq ft)",
  "Extra Large (200+ sq ft)"
];

// Room Type Options - Updated to match requirements
const ROOM_TYPE_OPTIONS = [
  { value: "single", label: "Single Room" },
  { value: "double", label: "Double Room" },
  { value: "ensuite", label: "Ensuite Room" },
  { value: "ensuite_double", label: "Ensuite Double Room" },
  { value: "studio", label: "Studio" }
];

// Property Type Options
const PROPERTY_TYPE_OPTIONS = [
  { value: "shared_house", label: "Shared House" },
  { value: "apartment", label: "Apartment" },
  { value: "studio", label: "Studio" },
  { value: "flat", label: "Flat" },
  { value: "house", label: "House" }
];

// ================= API SERVICE =================
const apiService = {
  async request(url, options = {}) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "API Error");
    }

    return data;
  },

  create(data) {
    return this.request(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(slug, data) {
    return this.request(`${process.env.NEXT_PUBLIC_API_URL}/listings/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  get(slug) {
    return this.request(`${process.env.NEXT_PUBLIC_API_URL}/listings/${slug}`);
  },
};

// Simple Map Placeholder Component
const MapIframe = ({ coordinates }) => {
  if (!coordinates || coordinates[0] === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-400">
        Enter address to see map
      </div>
    );
  }

  const lon = coordinates[0];
  const lat = coordinates[1];

  const delta = 0.0015; // 🔥 controls zoom (smaller = more zoom)

  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const marker = `${lat},${lon}`;

  return (
    <iframe
      width="100%"
      height="100%"
      className="rounded-2xl border border-slate-200"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
    />
  );
};

const ListingForm = ({ slug, existingData }) => {
  // Form data structured to match MongoDB schema
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "shared_house",
    roomType: "single",
    occupancy: "single",
    furnished: true,
    availableImmediately: false,
    featured: false,
    monthlyPrice: "",
    deposit: "",
    holdingDeposit: "",
    status: "available",
    availableFrom: "",
    minTenancy: 6,
    roomSize: "",
    floor: "",
    roomLabel: "",
    bathroomType: "shared",
    propertySharing: "shared",
    roomAmenities: [],
    propertyAmenities: [],
    billsIncluded: {
      electricity: true,
      gas: true,
      water: true,
      wifi: true,
    },
    wifiSpeed: "",
    parking: {
      available: false,
      type: "",
      details: "",
    },
    location: {
      address: "",
      city: "",
      postcode: "",
      coordinates: [0, 0],
    },
    propertyRef: "",
    epcRating: "",
    councilTaxBand: "",
    images: [],
  });

  const [pendingImages, setPendingImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const fetchLocationSuggestions = async (query) => {
    if (!query || query.length < 4) {
      setSuggestions([]);
      return;
    }

    setLoadingLocation(true);
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&limit=5&countrycodes=gb&format=json`
      );

      const data = await res.json();
      setSuggestions(data || []);
    } catch (err) {
      console.error("LocationIQ error:", err);
      setSuggestions([]);
    } finally {
      setLoadingLocation(false);
    }
  };

  const fetchCoordinates = async (query) => {
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/search?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&format=json&limit=1`
      );

      const data = await res.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];

        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [parseFloat(lon), parseFloat(lat)]
          }
        }));
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
  };

  const isEdit = !!slug;

  useEffect(() => {
    if (isEdit && slug) {
      fetchListingData();
    } else if (existingData) {
      // If existing data is passed as prop (for some use cases)
      populateFormData(existingData);
    }
  }, [slug, existingData]);

  const populateFormData = (data) => {
     // Log the data to debug
  console.log('Populating form with:', data);
    setFormData({
      title: data.title || "",
      description: data.description || "",
      propertyType: data.propertyType || "shared_house",
      roomType: data.roomType || "single",
      occupancy: data.occupancy || "single",
      furnished: data.furnished ?? true,
      availableImmediately: data.availableImmediately ?? false,
      featured: data.featured ?? false,
      monthlyPrice: data.monthlyPrice || "",
      deposit: data.deposit || "",
      holdingDeposit: data.holdingDeposit || "",
      status: data.status || "available",
      availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString().split('T')[0] : "",
      minTenancy: data.minTenancy || 6,
      roomSize: data.roomSize || "",
      floor: data.floor || "",
      roomLabel: data.roomLabel || "",
      bathroomType: data.bathroomType || "shared",
      propertySharing: data.propertySharing || "shared",
      roomAmenities: data.roomAmenities || [],
      propertyAmenities: data.propertyAmenities || [],
      billsIncluded: {
        electricity: data.billsIncluded?.electricity ?? true,
        gas: data.billsIncluded?.gas ?? true,
        water: data.billsIncluded?.water ?? true,
        wifi: data.billsIncluded?.wifi ?? true,
      },
      wifiSpeed: data.wifiSpeed || "",
      parking: data.parking || {
        available: false,
        type: "",
        details: "",
      },
      location: data.location || {
        address: "",
        city: "",
        postcode: "",
        coordinates: [0, 0],
      },
      propertyRef: data.propertyRef || "",
      epcRating: data.epcRating || "",
      councilTaxBand: data.councilTaxBand || "",
      images: data.images || [],
    });
  };

  const fetchListingData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get(slug);
      console.log('Full API Response:', response);
      
      // Check if response exists
      if (!response) {
        throw new Error('No response received from server');
      }
      
      // Extract the listing data (your API returns { success: true, listing: {...} })
      let listingData;
      if (response.listing) {
        listingData = response.listing;
      } else if (response.data) {
        listingData = response.data;
      } else {
        listingData = response;
      }
      
      console.log('Extracted listing data to populate form:', listingData);
      
      // Verify we have data before populating
      if (listingData && Object.keys(listingData).length > 0) {
        populateFormData(listingData);
      } else {
        throw new Error('No listing data found in response');
      }
      
    } catch (error) {
      console.error('Failed to fetch listing:', error);
      setErrors({ submit: `Failed to load listing data: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload single image to Cloudinary in background
  const uploadSingleImage = async (file, index) => {
    try {
      setUploadProgress(prev => ({ ...prev, [index]: 'uploading' }));
      const result = await uploadToCloudinary(file);
      setUploadProgress(prev => ({ ...prev, [index]: 'completed' }));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.url]
      }));
      
      return result.url;
    } catch (error) {
      setUploadProgress(prev => ({ ...prev, [index]: 'failed' }));
      console.error(`Failed to upload image ${index + 1}:`, error);
      throw error;
    }
  };

  // Handle image selection - upload immediately in background
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = formData.images.length + pendingImages.length + files.length;

    if (totalFiles > 40) {
      setErrors(prev => ({ ...prev, images: "Maximum 40 images allowed" }));
      return;
    }

    if (files.some(file => !file.type.startsWith('image/'))) {
      setErrors(prev => ({ ...prev, images: "Only image files are allowed" }));
      return;
    }

    setErrors(prev => ({ ...prev, images: undefined }));
    
    const newPendingImages = [...pendingImages, ...files];
    setPendingImages(newPendingImages);
    
    const startIndex = pendingImages.length;
    for (let i = 0; i < files.length; i++) {
      const fileIndex = startIndex + i;
      try {
        await uploadSingleImage(files[i], fileIndex);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setTimeout(() => {
      setPendingImages(prev => {
        const failed = prev.filter((_, idx) => uploadProgress[idx] === 'failed');
        return failed;
      });
    }, 1000);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData(prev => ({ ...prev, images: newImages }));
    } else {
      setPendingImages(prev => prev.filter((_, i) => i !== index));
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });
    }
  };

  const retryUpload = async (index) => {
    const file = pendingImages[index];
    if (file) {
      try {
        await uploadSingleImage(file, index);
        setPendingImages(prev => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }
  };

  const selectSuggestion = (item) => {
    const addr = item.address || {};

    const street = addr.road || addr.pedestrian || addr.footway || "";
    const house = addr.house_number || "";
    const city = addr.city || addr.town || addr.village || "";
    const postcode = addr.postcode || "";

    const cleanAddress = [house, street].filter(Boolean).join(" ");

    setFormData(prev => ({
      ...prev,
      location: {
        address: cleanAddress || item.display_name,
        city: city,
        postcode: postcode,
        coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
      }
    }));

    setSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];

      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));

      setActiveField(field);

      // ✅ IMPORTANT
      fetchLocationSuggestions(value);

       // 🔥 NEW: auto get coordinates
      if (field === "address" && value.length > 40) {
        fetchCoordinates(value);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNested = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleAmenities = (type, value) => {
    setFormData(prev => {
      const list = prev[type];
      return {
        ...prev,
        [type]: list.includes(value) ? list.filter(i => i !== value) : [...list, value]
      };
    });
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.monthlyPrice || formData.monthlyPrice <= 0) newErrors.monthlyPrice = "Valid monthly price is required";
    if (!formData.location.address?.trim()) newErrors['location.address'] = "Address is required";
    if (!formData.location.city?.trim()) newErrors['location.city'] = "City is required";
    if (!formData.location.postcode?.trim()) newErrors['location.postcode'] = "Postcode is required";
    if (!formData.availableFrom) newErrors.availableFrom = "Available from date is required";
    if (!formData.minTenancy) newErrors.minTenancy = "Minimum tenancy is required";
    if (!formData.roomSize) newErrors.roomSize = "Room size is required";
    if (!formData.floor) newErrors.floor = "Floor is required";
    
    const totalImages = formData.images.length;
    if (totalImages < 5) newErrors.images = `Minimum 5 images required (${totalImages}/5)`;
    
    if (!formData.epcRating) newErrors.epcRating = "EPC rating is required";
    
    if (formData.billsIncluded.wifi && !formData.wifiSpeed?.trim()) {
      newErrors.wifiSpeed = "WiFi speed is required when WiFi is included";
    }
    
    if (formData.parking.available && !formData.parking.type) {
      newErrors.parkingType = "Please select parking type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    
    if (pendingImages.length > 0) {
      const stillUploading = Object.values(uploadProgress).some(progress => progress === 'uploading');
      if (stillUploading) {
        setErrors({ submit: 'Please wait for images to finish uploading' });
        return;
      }
      
      const failedUploads = Object.values(uploadProgress).some(progress => progress === 'failed');
      if (failedUploads) {
        setErrors({ submit: 'Some images failed to upload. Please retry or remove them.' });
        return;
      }
    }
    
    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        occupancy: formData.occupancy,
        furnished: formData.furnished,
        availableImmediately: formData.availableImmediately,
        featured: formData.featured,
        monthlyPrice: parseFloat(formData.monthlyPrice),
        deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
        holdingDeposit: formData.holdingDeposit ? parseFloat(formData.holdingDeposit) : undefined,
        status: formData.status,
        availableFrom: formData.availableFrom,
        minTenancy: parseInt(formData.minTenancy),
        roomSize: formData.roomSize,
        floor: formData.floor,
        roomLabel: formData.roomLabel,
        bathroomType: formData.bathroomType,
        propertySharing: formData.propertySharing,
        roomAmenities: formData.roomAmenities,
        propertyAmenities: formData.propertyAmenities,
        billsIncluded: formData.billsIncluded,
        wifiSpeed: formData.wifiSpeed,
        parking: {
          available: formData.parking.available,
          ...(formData.parking.available && formData.parking.type && {
            type: formData.parking.type
          }),
          ...(formData.parking.available && formData.parking.details && {
            details: formData.parking.details
          })
        },
        location: {
          address: formData.location.address,
          city: formData.location.city,
          postcode: formData.location.postcode,
          coordinates: formData.location.coordinates,
          type: "Point"
        },
        propertyRef: formData.propertyRef,
        epcRating: formData.epcRating,
        councilTaxBand: formData.councilTaxBand,
        images: formData.images,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      
      let response;
      if (isEdit) {
        response = await apiService.update(slug, submitData);
      } else {
        response = await apiService.create(submitData);
      }
      
      console.log('Success:', response);
      alert(isEdit ? 'Listing updated successfully!' : 'Listing created successfully!');
      
      if (!isEdit) {
        // Reset form for new listing
        setFormData({
          title: "",
          description: "",
          propertyType: "shared_house",
          roomType: "single",
          occupancy: "single",
          furnished: true,
          availableImmediately: false,
          featured: false,
          monthlyPrice: "",
          deposit: "",
          holdingDeposit: "",
          status: "available",
          availableFrom: "",
          minTenancy: 6,
          roomSize: "",
          floor: "",
          roomLabel: "",
          bathroomType: "shared",
          propertySharing: "shared",
          roomAmenities: [],
          propertyAmenities: [],
          billsIncluded: {
            electricity: true,
            gas: true,
            water: true,
            wifi: true,
          },
          wifiSpeed: "",
          parking: {
            available: false,
            type: "",
            details: "",
          },
          location: {
            address: "",
            city: "",
            postcode: "",
            coordinates: [0, 0],
          },
          propertyRef: "",
          epcRating: "",
          councilTaxBand: "",
          images: [],
        });
        setPendingImages([]);
        setUploadProgress({});
        setTouched({});
        setSubmitAttempted(false);
      }
      
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ submit: error.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = (field) => {
    return errors[field] && (touched[field] || submitAttempted);
  };

  const totalImagesCount = formData.images.length + pendingImages.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading listing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Debug info - remove in production */}
        {isEdit && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-700">
            Editing mode: {slug}
          </div>
        )}
        
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}
        
        {/* --- STICKY HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-[#F8F9FB]/80 backdrop-blur-md py-4">
          <div>
            <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">
              <Layout size={14} /> Property Management
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isEdit ? "Edit Listing" : "New Property Listing"}
            </h1>
          </div>
          <div className="flex gap-3">
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEdit ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  {isEdit ? "Update Changes" : "Publish Listing"}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- MAIN COLUMN --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* BASIC INFO */}
            <Section card title="Basic Information" icon={<Home className="text-orange-500" />}>
              <div className="space-y-5">
                <div>
                  <label className="label-style">Listing Title *</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('title')}
                    placeholder="e.g. Luxury Double Room in Canary Wharf" 
                    className={`input-style ${hasError('title') ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                  />
                  {hasError('title') && <ErrorMessage message={errors.title} />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-style">Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="input-style">
                      {PROPERTY_TYPE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-style">Room Label</label>
                    <input name="roomLabel" value={formData.roomLabel} onChange={handleChange} placeholder="e.g. Room A" className="input-style" />
                  </div>
                </div>
                <div>
                  <label className="label-style">Description *</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('description')}
                    rows="4" 
                    placeholder="Tell potential tenants about the vibe of the house..." 
                    className={`input-style resize-none ${hasError('description') ? 'border-red-300' : ''}`}
                  />
                  {hasError('description') && <ErrorMessage message={errors.description} />}
                </div>
              </div>
            </Section>

            {/* ROOM DETAILS */}
            <Section card title="Room & Occupancy" icon={<Bed className="text-blue-500" />}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="label-style">Room Type *</label>
                  <select name="roomType" value={formData.roomType} onChange={handleChange} className="input-style">
                    {ROOM_TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-style">Occupancy</label>
                  <select name="occupancy" value={formData.occupancy} onChange={handleChange} className="input-style">
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                  </select>
                </div>
                <div>
                  <label className="label-style">Bathroom</label>
                  <select name="bathroomType" value={formData.bathroomType} onChange={handleChange} className="input-style">
                    <option value="shared">Shared</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="label-style flex items-center gap-1">Room Size *</label>
                  <select 
                    name="roomSize" 
                    value={formData.roomSize} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('roomSize')}
                    className={`input-style ${hasError('roomSize') ? 'border-red-300' : ''}`}
                  >
                    <option value="">Select room size</option>
                    {ROOM_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {hasError('roomSize') && <ErrorMessage message={errors.roomSize} />}
                </div>

                <div>
                  <label className="label-style flex items-center gap-1">Floor *</label>
                  <select 
                    name="floor" 
                    value={formData.floor} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('floor')}
                    className={`input-style ${hasError('floor') ? 'border-red-300' : ''}`}
                  >
                    <option value="">Select floor</option>
                    {FLOOR_OPTIONS.map(floor => (
                      <option key={floor} value={floor}>{floor}</option>
                    ))}
                  </select>
                  {hasError('floor') && <ErrorMessage message={errors.floor} />}
                </div>

                <div>
                  <label className="label-style">Minimum Tenancy (months) *</label>
                  <select 
                    name="minTenancy" 
                    value={formData.minTenancy} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('minTenancy')}
                    className={`input-style ${hasError('minTenancy') ? 'border-red-300' : ''}`}
                  >
                    <option value="">Select minimum tenancy</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                      <option key={month} value={month}>
                        {month} {month === 1 ? 'Month' : 'Months'}
                      </option>
                    ))}
                  </select>
                  {hasError('minTenancy') && <ErrorMessage message={errors.minTenancy} />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Toggle label="Fully Furnished" checked={formData.furnished} onChange={(e)=>handleChange({target:{name:"furnished",type:"checkbox",checked:e.target.checked}})} />
                <Toggle label="Available Immediately" checked={formData.availableImmediately} onChange={(e)=>handleChange({target:{name:"availableImmediately",type:"checkbox",checked:e.target.checked}})} />
                <Toggle label="Featured Property" checked={formData.featured} onChange={(e)=>handleChange({target:{name:"featured",type:"checkbox",checked:e.target.checked}})} />
              </div>
            </Section>

            {/* AMENITIES */}
            <Section card title="Amenities" icon={<CheckCircle2 className="text-emerald-500" />}>
               <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1 h-1 bg-slate-400 rounded-full"/> Room Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ROOM_AMENITIES.map(item => (
                        <CheckboxTag key={item} label={item} checked={formData.roomAmenities.includes(item)} onChange={()=>handleAmenities("roomAmenities",item)} />
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-50">
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1 h-1 bg-slate-400 rounded-full"/> Property Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {PROPERTY_AMENITIES.map(item => (
                        <CheckboxTag key={item} label={item} checked={formData.propertyAmenities.includes(item)} onChange={()=>handleAmenities("propertyAmenities",item)} />
                      ))}
                    </div>
                  </div>
               </div>
            </Section>

            {/* PROPERTY IMAGES */}
            <Section card title="Property Images" icon={<Info className="text-pink-500" />}>
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${hasError('images') ? 'border-red-300 bg-red-50/30' : 'border-slate-300 hover:border-orange-400'}`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImages}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-slate-100 rounded-full">
                        <Upload size={24} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">
                        Click to upload images
                      </p>
                      <p className="text-xs text-slate-400">
                        Images upload automatically in background
                      </p>
                      <p className="text-xs text-slate-400">
                        Minimum 5 images required (Max 10)
                      </p>
                      <p className={`text-xs mt-2 font-semibold ${totalImagesCount >= 5 ? 'text-green-500' : 'text-orange-500'}`}>
                        {totalImagesCount}/5 images uploaded
                      </p>
                    </div>
                  </label>
                </div>

                {hasError('images') && <ErrorMessage message={errors.images} />}

                {/* Uploaded Images */}
                {formData.images.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2">Uploaded Images</h4>
                    <ReactSortable
  list={formData.images.map((url, index) => ({
    id: index,
    url,
  }))}
  setList={(newList) =>
    setFormData((prev) => ({
      ...prev,
      images: newList.map((item) => item.url),
    }))
  }
  className="grid grid-cols-2 md:grid-cols-4 gap-4"
>
  {formData.images.map((url, index) => (
    <div
      key={`${url}-${index}`}
      className="relative group cursor-move"
    >
      <img
        src={url}
        alt={`uploaded ${index + 1}`}
        className="w-full h-28 object-cover rounded-xl border border-slate-200"
      />

      {index === 0 && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-lg font-bold">
          Featured
        </div>
      )}

      <button
        type="button"
        onClick={() => removeImage(index, true)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <X size={12} />
      </button>
    </div>
  ))}
</ReactSortable>
                  </div>
                )}

                {/* Pending Images (Uploading in Background) */}
                {pendingImages.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2">Uploading Images</h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      {pendingImages.map((img, index) => (
                        <div key={`pending-${index}`} className="relative group">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`uploading ${index + 1}`}
                            className="w-full h-24 object-cover rounded-xl border border-slate-200"
                          />
                          {uploadProgress[index] === 'uploading' && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
                              <Loader2 size={20} className="animate-spin text-white mb-1" />
                              <span className="text-white text-xs">Uploading...</span>
                            </div>
                          )}
                          {uploadProgress[index] === 'failed' && (
                            <div className="absolute inset-0 bg-red-500/50 rounded-xl flex flex-col items-center justify-center">
                              <AlertCircle size={20} className="text-white mb-1" />
                              <button
                                onClick={() => retryUpload(index)}
                                className="text-white text-xs underline"
                              >
                                Retry
                              </button>
                            </div>
                          )}
                          {!uploadProgress[index] && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                              <Loader2 size={20} className="animate-spin text-white" />
                            </div>
                          )}
                          <button
                            onClick={() => removeImage(index, false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                            disabled={uploadProgress[index] === 'uploading'}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* --- SIDEBAR COLUMN --- */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* PRICING & STATUS */}
            <Section card title="Financials" icon={<PoundSterling className="text-amber-500" />}>
              <div className="space-y-4">
                <div className={`bg-orange-50 p-4 rounded-2xl border ${hasError('monthlyPrice') ? 'border-red-300' : 'border-orange-100'}`}>
                  <label className="label-style !text-orange-700">Monthly Rent *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-orange-600">£</span>
                    <input 
                      name="monthlyPrice" 
                      value={formData.monthlyPrice} 
                      onChange={handleChange}
                      onBlur={() => handleBlur('monthlyPrice')}
                      className="input-style !bg-white !pl-7 !border-orange-200 !text-orange-900 font-black text-lg" 
                      placeholder="0.00" 
                    />
                  </div>
                  {hasError('monthlyPrice') && <ErrorMessage message={errors.monthlyPrice} />}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input name="deposit" value={formData.deposit} onChange={handleChange} placeholder="Deposit (£)" className="input-style text-xs" />
                  </div>
                  <div>
                    <input name="holdingDeposit" value={formData.holdingDeposit} onChange={handleChange} placeholder="Holding Fee (£)" className="input-style text-xs" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 space-y-4">
                   <div>
                     <label className="label-style">Available From *</label>
                     <input 
                       type="date" 
                       name="availableFrom" 
                       value={formData.availableFrom} 
                       onChange={handleChange}
                       onBlur={() => handleBlur('availableFrom')}
                       className={`input-style ${hasError('availableFrom') ? 'border-red-300' : ''}`} 
                     />
                     {hasError('availableFrom') && <ErrorMessage message={errors.availableFrom} />}
                   </div>
                   <select name="status" value={formData.status} onChange={handleChange} className="input-style font-bold">
                    <option value="available">Status: Available</option>
                    <option value="reserved">Status: Reserved</option>
                    <option value="rented">Status: Rented</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* LOCATION with Simple Map */}
            <Section card title="Location" icon={<MapPin className="text-red-500" />}>
              <div className="space-y-3">
                <div>
                  <label className="label-style">Street Address *</label>
                  <div className="relative">
                    <input 
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleChange}
                      onFocus={() => setActiveField("address")}
                      placeholder="Street Address *"
                      className="input-style"
                    />

                    {loadingLocation && activeField === "address" && (
                      <div className="absolute right-3 top-3">
                        <Loader2 size={16} className="animate-spin text-gray-400" />
                      </div>
                    )}

                    {suggestions.length > 0 && activeField === "address" && (
                      <div className="absolute z-50 bg-white border rounded-xl mt-1 w-full shadow-lg max-h-60 overflow-auto">
                        {suggestions.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => selectSuggestion(item)}
                            className="px-4 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                          >
                            {item.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {hasError('location.address') && <ErrorMessage message={errors['location.address']} />}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input 
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      onFocus={() => setActiveField("city")}
                      placeholder="City *"
                      className="input-style"
                    />
                    {hasError('location.city') && <ErrorMessage message={errors['location.city']} />}
                  </div>
                  <div>
                    <input 
                      name="location.postcode"
                      value={formData.location.postcode}
                      onChange={handleChange}
                      onFocus={() => setActiveField("postcode")}
                      placeholder="Postcode *"
                      className="input-style"
                    />
                    {hasError('location.postcode') && <ErrorMessage message={errors['location.postcode']} />}
                  </div>
                </div>
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200">
                  <MapIframe
                    coordinates={formData.location.coordinates}
                  />
                </div>
              </div>
            </Section>

            {/* BILLS & PARKING */}
            <Section card title="Utilities" icon={<Zap className="text-indigo-500" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {["electricity","gas","water","wifi"].map(bill => (
                    <div key={bill} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black uppercase text-slate-500">{bill}</span>
                      <Toggle small checked={formData.billsIncluded[bill]} onChange={(e)=>handleNested("billsIncluded",bill,e.target.checked)} />
                    </div>
                  ))}
                </div>
                <div>
                  <input 
                    name="wifiSpeed" 
                    value={formData.wifiSpeed} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('wifiSpeed')}
                    placeholder="e.g. 400mbps Fiber *" 
                    className={`input-style ${hasError('wifiSpeed') ? 'border-red-300' : ''}`} 
                  />
                  {hasError('wifiSpeed') && <ErrorMessage message={errors.wifiSpeed} />}
                </div>
                
                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Car size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Parking Info</span>
                  </div>
                  <Toggle label="Parking Available" checked={formData.parking.available} onChange={(e)=>handleNested("parking","available",e.target.checked)} />
                  {formData.parking.available && (
                    <>
                      <select 
                        value={formData.parking.type} 
                        onChange={(e) => {
                          const value = e.target.value;
                          handleNested("parking", "type", value === "" ? undefined : value);
                        }}
                        onBlur={() => handleBlur('parkingType')}
                        className={`input-style text-xs ${hasError('parkingType') ? 'border-red-300' : ''}`}
                      >
                        <option value="">Select Type...</option>
                        <option value="on_street">On Street</option>
                        <option value="off_street">Off Street</option>
                        <option value="garage">Garage</option>
                        <option value="permit">Permit</option>
                      </select>
                      {hasError('parkingType') && <ErrorMessage message={errors.parkingType} />}
                    </>
                  )}
                </div>
              </div>
            </Section>

            {/* COMPLIANCE */}
            <Section card title="Compliance" icon={<ShieldCheck className="text-slate-500" />}>
              <div className="space-y-3">
                <div>
                  <input name="propertyRef" value={formData.propertyRef} onChange={handleChange} placeholder="Property Reference" className="input-style text-xs" />
                </div>
                <div>
                  <input name="councilTaxBand" value={formData.councilTaxBand} onChange={handleChange} placeholder="Council Tax Band" className="input-style text-xs" />
                </div>
                <div>
                  <label className="label-style">EPC Rating *</label>
                  <div className="flex gap-1">
                    {['A','B','C','D','E','F','G'].map(r => (
                      <button 
                        key={r} 
                        type="button"
                        onClick={() => {
                          handleChange({target: {name: 'epcRating', value: r}});
                          handleBlur('epcRating');
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all border ${formData.epcRating === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  {hasError('epcRating') && <ErrorMessage message={errors.epcRating} />}
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-style {
          @apply w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300;
        }
        .label-style {
          @apply block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest;
        }
      `}</style>
    </div>
  );
};

// ================= REUSABLE UI COMPONENTS =================

const Section = ({ title, icon, children, card }) => (
  <div className={`${card ? 'bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden' : ''}`}>
    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CheckboxTag = ({ label, checked, onChange }) => (
  <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border ${checked ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span className="text-[11px] font-bold capitalize">{label.replace(/_/g, ' ')}</span>
    {checked && <CheckCircle2 size={12} />}
  </label>
);

const Toggle = ({ label, checked, onChange, small }) => (
  <label className="flex items-center justify-between gap-3 cursor-pointer group">
    {label && <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>}
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className={`${small ? 'w-8 h-4' : 'w-11 h-6'} bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-all`}></div>
      <div className={`absolute top-1 left-1 bg-white rounded-full ${small ? 'w-2 h-2' : 'w-4 h-4'} transition-all peer-checked:translate-x-full`}></div>
    </div>
  </label>
);

const ErrorMessage = ({ message }) => (
  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
    <AlertCircle size={12} />
    <span>{message}</span>
  </div>
);

export default ListingForm;