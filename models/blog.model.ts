import mongoose, { Schema, Document } from 'mongoose'
import slugify from 'slugify'

export interface IBlog extends Document {
  title: string
  summary: string
  slug: string
  banner: mongoose.Types.ObjectId
  content: string
  created_by?: string
  created_time?: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    slug: { type: String, unique: true },
    banner: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
    content: { type: String, required: true },
    created_by: { type: String, default: 'Admin' },
    created_time: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

BlogSchema.pre('save', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

BlogSchema.index({ title: 'text', summary: 'text' })

export default mongoose.models?.Blog || mongoose.model<IBlog>('Blog', BlogSchema)
