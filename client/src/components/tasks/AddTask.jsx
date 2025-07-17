import { Dialog } from "@headlessui/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { app } from "../../utils/firebase";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
  const { user } = useSelector((state) => state.auth); // Assuming Redux has user info

  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    stage: task?.stage?.toUpperCase() || LISTS[0],
    priority: task?.priority?.toUpperCase() || PRIORITY[2],
    assets: [],
    description: task?.description || "",
    links: task?.links || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(defaultValues.stage);
  const [priority, setPriority] = useState(defaultValues.priority);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const handleFileUpload = async (files) => {
    const urls = [];
    const storage = getStorage(app);

    for (const file of files) {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const url = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          () =>
            getDownloadURL(uploadTask.snapshot.ref)
              .then(resolve)
              .catch(reject)
        );
      });

      urls.push(url);
    }

    return urls;
  };

  const handleOnSubmit = async (data) => {
    setUploading(true);

    try {
      let uploadedUrls = [];
      if (assets.length > 0) {
        uploadedUrls = await handleFileUpload(assets);
      }

      const payload = {
        ...data,
        stage,
        priority,
        team: [user._id], // Auto-assign current user
        assets: [...(task?.assets || []), ...uploadedUrls],
        links: data.links.split(",").map((link) => link.trim()),
      };

      const response = task?._id
        ? await updateTask({ ...payload, _id: task._id }).unwrap()
        : await createTask(payload).unwrap();

      toast.success(response.message);
      setOpen(false);
    } catch (error) {
      console.error("Task submission error:", error);
      toast.error(error?.data?.message || error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title className='text-lg font-bold mb-4'>
          {task ? "Update Task" : "Add Task"}
        </Dialog.Title>

        <div className='flex flex-col gap-6'>
          <Textbox
            label='Task Title'
            name='title'
            placeholder='Enter task title'
            register={register("title", { required: "Title is required!" })}
            error={errors.title?.message}
          />

          <div className='flex gap-4'>
            <SelectList
              label='Task Stage'
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />
            <SelectList
              label='Priority'
              lists={PRIORITY}
              selected={priority}
              setSelected={setPriority}
            />
          </div>

          <Textbox
            label='Date'
            name='date'
            type='date'
            register={register("date", { required: "Date is required!" })}
            error={errors.date?.message}
          />

          <div className='w-full flex items-center justify-start'>
            <label
              htmlFor='imgUpload'
              className='flex items-center gap-1 text-base cursor-pointer text-blue-700 hover:underline'
            >
              <BiImages />
              <span>Upload Assets</span>
            </label>
            <input
              id='imgUpload'
              type='file'
              multiple
              onChange={(e) => setAssets(e.target.files)}
              accept='.jpg,.jpeg,.png'
              className='hidden'
            />
          </div>

          <div>
            <label className='block mb-1'>Description</label>
            <textarea
              {...register("description")}
              className='w-full border rounded p-2'
              rows={4}
            />
          </div>

          <div>
            <label className='block mb-1'>Links (comma separated)</label>
            <textarea
              {...register("links")}
              className='w-full border rounded p-2'
              rows={2}
            />
          </div>
        </div>

        {(isLoading || isUpdating || uploading) ? (
          <div className='py-4'>
            <Loading />
          </div>
        ) : (
          <div className='mt-6 flex justify-end gap-3'>
            <Button
              type='button'
              label='Cancel'
              className='bg-gray-100 text-gray-700'
              onClick={() => setOpen(false)}
            />
            <Button
              type='submit'
              label={task ? "Update Task" : "Create Task"}
              className='bg-blue-600 text-white'
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
